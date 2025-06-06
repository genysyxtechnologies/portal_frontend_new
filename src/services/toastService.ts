export interface ToastOptions {
  title?: string
  duration?: number
  dismissible?: boolean
  action?: () => void
  actionText?: string
}

export interface ToastItem extends ToastOptions {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

class ToastService {
  private toasts: ToastItem[] = []
  private listeners: Set<(toasts: ToastItem[]) => void> = new Set()
  private toastId = 0

  subscribe(callback: (toasts: ToastItem[]) => void) {
    this.listeners.add(callback)
    callback(this.toasts) // Send current state
    
    return () => {
      this.listeners.delete(callback)
    }
  }

  private notify() {
    this.listeners.forEach(callback => callback([...this.toasts]))
  }

  private addToast(type: ToastItem['type'], message: string, options: ToastOptions = {}) {
    const toast: ToastItem = {
      id: `toast-${++this.toastId}`,
      type,
      message,
      duration: 5000,
      dismissible: true,
      ...options
    }

    this.toasts.push(toast)
    this.notify()

    // Auto remove after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.remove(toast.id)
      }, toast.duration)
    }

    return toast.id
  }

  success(message: string, options?: ToastOptions) {
    return this.addToast('success', message, options)
  }

  error(message: string, options?: ToastOptions) {
    return this.addToast('error', message, options)
  }

  warning(message: string, options?: ToastOptions) {
    return this.addToast('warning', message, options)
  }

  info(message: string, options?: ToastOptions) {
    return this.addToast('info', message, options)
  }

  remove(id: string) {
    const index = this.toasts.findIndex(toast => toast.id === id)
    if (index !== -1) {
      this.toasts.splice(index, 1)
      this.notify()
    }
  }

  clear() {
    this.toasts = []
    this.notify()
  }

  getToasts() {
    return [...this.toasts]
  }
}

// Create singleton instance
export const toastService = new ToastService()

// Global toast helper for browser environment
if (typeof window !== 'undefined') {
  (window as any).$toast = {
    success: (message: string, options?: ToastOptions) => toastService.success(message, options),
    error: (message: string, options?: ToastOptions) => toastService.error(message, options),
    warning: (message: string, options?: ToastOptions) => toastService.warning(message, options),
    info: (message: string, options?: ToastOptions) => toastService.info(message, options),
    clear: () => toastService.clear()
  }
}

export default toastService