// src/utils/PaymentGateway.ts - Modern TypeScript implementation
import apiClient from '@/services/api/apiClient'
import type { PaymentData, PaymentConfig } from '@/types/student/fee.information'

// Payment Gateway Types
export enum GateWays {
  PAYSTACK = 'Paystack',
  REMITA = 'Remita'
}

// Component interface for Vue components that use payment gateway
interface PaymentComponent {
  loading: boolean
  message: string
  messageType: string
  messageShow: boolean
}

// Payment response interfaces
interface PaystackResponse {
  reference: string
  status: string
  trans: string
  transaction: string
  trxref: string
}

interface RemitaResponse {
  responseId: string
  responseCode: string
  responseDescription: string
}

// Global payment gateway declarations
declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: any) => {
        openIframe: () => void
      }
    }
    RmPaymentEngine?: {
      init: (config: any) => {
        showPaymentWidget: () => void
      }
    }
  }
}

let tagId = 'paymentTagId'
let gConfig: PaymentConfig | null = null

// Utility functions for script loading
const scriptExists = (): boolean => {
  const element = document.getElementById(tagId)
  return element !== null
}

const createTag = (link: string, callback?: () => void): void => {
  const paymentScript = document.createElement('script')
  paymentScript.setAttribute('id', tagId)
  paymentScript.setAttribute('src', link)
  document.head.appendChild(paymentScript)

  paymentScript.onload = () => {
    if (callback && typeof callback === 'function') {
      callback()
    }
  }

  paymentScript.onerror = () => {
    console.error(`Failed to load payment script from ${link}`)
  }
}

const loadScript = (script: string, callback?: () => void): void => {
  if (scriptExists()) {
    if (callback) callback()
    return
  }
  createTag(script, callback)
}

// Paystack payment implementation
const payWithPaystack = (
  paymentData: PaymentData,
  component: PaymentComponent,
  verificationLink: string,
  successCallback: (data: any) => void,
  preferredServerCallback?: (reference: string) => void
): void => {
  if (!window.PaystackPop) {
    throw new Error('Paystack script not loaded')
  }

  const { email, amount, currency, invoice, paymentId } = paymentData

  const handler = window.PaystackPop.setup({
    key: gConfig?.publicKey,
    email,
    amount: amount * 100, // Convert to kobo
    currency,
    ref: invoice,
    metadata: {
      trx: paymentId
    },

    callback: async (response: PaystackResponse) => {
      try {
        if (preferredServerCallback) {
          preferredServerCallback(response.reference)
        } else {
          component.loading = true
          const verifyUrl = verificationLink + (verificationLink.endsWith('/') ? '' : '/') + response.reference

          const res = await apiClient.put(verifyUrl)

          component.message = 'Transaction Completed and Verified!'
          component.messageType = 'success'
          component.messageShow = true

          successCallback(res.data)
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        component.message = 'Payment verification failed'
        component.messageType = 'error'
        component.messageShow = true
      } finally {
        component.loading = false
      }
    },

    onClose: () => {
      component.message = 'Transaction cancelled by user'
      component.messageType = 'info'
      component.messageShow = true
    }
  })

  handler.openIframe()
}

// Remita payment implementation
const payWithRemita = (
  rrr: string,
  gateway: PaymentConfig,
  successCallback: (reference: string) => void
): void => {
  if (!window.RmPaymentEngine) {
    throw new Error('Remita script not loaded')
  }

  const data = {
    customFields: [
      {
        name: 'rrr',
        value: rrr
      }
    ]
  }

  const paymentEngine = window.RmPaymentEngine.init({
    key: gateway.publicKey,
    processRrr: true,
    extendedData: data,
    onSuccess: (response: RemitaResponse) => {
      console.log('Remita payment success:', response)
      successCallback(rrr)
    },
    onError: (response: RemitaResponse) => {
      console.error('Remita payment error:', response)
    },
    onClose: () => {
      console.log('Remita payment widget closed')
    }
  })

  paymentEngine.showPaymentWidget()
}

/**
 * PaymentGateway Class - handles multiple payment gateways with TypeScript support
 */
export class PaymentGateway {
  private gateWay: string | null = null
  private component: PaymentComponent | null = null
  private verificationLink: string
  private gConfig: PaymentConfig | null = null

  constructor(
    gateWay: string | null = null,
    component: PaymentComponent | null = null,
    verificationLink: string = ''
  ) {
    this.gateWay = gateWay
    this.component = component
    this.verificationLink = verificationLink
  }

  /**
   * Must be called first before calling any other method
   * Loads the script (JS SDK) required for the payment gateway
   */
  async initializeGateway(config: PaymentConfig, callback?: () => void): Promise<void> {
    if (!config) {
      throw new Error('Config must be a valid object')
    }

    if (!config.name) {
      throw new Error('No gateway name defined in config')
    }

    this.gConfig = config
    this.gateWay = config.name
    gConfig = config

    return new Promise((resolve, reject) => {
      const onLoad = () => {
        if (callback) callback()
        resolve()
      }

      const onError = () => {
        reject(new Error(`Failed to load payment gateway script: ${config.paymentLink}`))
      }

      try {
        loadScript(config.paymentLink, onLoad)
      } catch (error) {
        onError()
      }
    })
  }

  /**
   * Call method after all required data for payment are ready
   */
  makePayment(
    paymentData: PaymentData,
    successCallback: (data: any) => void,
    preferredServerCallback?: (reference: string) => void
  ): void {
    if (!this.gateWay) {
      throw new Error('No gateway defined. Call initializeGateway first.')
    }

    // if (!this.component) {
    //   throw new Error('No component reference provided')
    // }

    if (!paymentData.email || !paymentData.amount || !paymentData.currency) {
      throw new Error('Missing required payment data')
    }

    try {
      switch (this.gateWay) {
        case GateWays.PAYSTACK:
          payWithPaystack(
            paymentData,
            this.component,
            this.verificationLink,
            successCallback,
            preferredServerCallback
          )
          break

        case GateWays.REMITA:
          if (!this.gConfig) {
            throw new Error('Gateway config not initialized')
          }
          payWithRemita(
            paymentData.invoice,
            this.gConfig,
            preferredServerCallback || (() => successCallback(paymentData.invoice))
          )
          break

        default:
          throw new Error(`Unsupported payment gateway: ${this.gateWay}`)
      }
    } catch (error) {
      console.error('Payment error:', error)
      if (this.component) {
        this.component.message = error instanceof Error ? error.message : 'Payment failed'
        this.component.messageType = 'error'
        this.component.messageShow = true
      }
      throw error
    }
  }

  /**
   * Get the current gateway configuration
   */
  getConfig(): PaymentConfig | null {
    return this.gConfig
  }

  /**
   * Get the current gateway name
   */
  getGateway(): string | null {
    return this.gateWay
  }

  /**
   * Check if the gateway is initialized
   */
  isInitialized(): boolean {
    return this.gateWay !== null && this.gConfig !== null
  }

  /**
   * Set component reference for UI updates
   */
  setComponent(component: PaymentComponent): void {
    this.component = component
  }

  /**
   * Update verification link
   */
  setVerificationLink(link: string): void {
    this.verificationLink = link
  }
}

// Export utility functions for direct use
export {
  loadScript,
  scriptExists,
  payWithPaystack,
  payWithRemita
}

// Export types for external use
export type {
  PaymentComponent,
  PaystackResponse,
  RemitaResponse
}
