import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

// Define response type structure
export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

// Define API client configuration type
export interface ApiClientConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
}

class ApiClient {
  private instance: AxiosInstance

  constructor(config: ApiClientConfig) {
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...config.headers,
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Get token from storage
        const token = localStorage.getItem('auth_token')

        // If token exists, add to headers
        if (token && config.url?.includes("authenticate")) {
          config.headers.Authorization = `Bearer ${token}`
          config.withCredentials = true
        } else{
          config.withCredentials = false
        }

        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle specific error codes
        if (error.response) {
          const { status } = error.response

          // Authentication errors
          if (status === 401) {
            // Clear authentication state
            localStorage.removeItem('auth_token')
            localStorage.removeItem('isAuthenticated')

            // Redirect to login page if not already there
            if (window.location.pathname !== '/auth/login') {
              window.location.href = '/auth/login'
            }
          }

          // Permission errors
          if (status === 403) {
            // Redirect to forbidden page
            window.location.href = '/auth/forbidden'
          }

          // Not found errors
          if (status === 404) {
            // Handle 404 errors
            console.error('Resource not found')
          }

          // Server errors
          if (status >= 500) {
            // Log server errors
            console.error('Server error', error.response.data)
          }
        }

        return Promise.reject(error)
      },
    )
  }

  // Generic request method
  public async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.instance.request(config)
      return response.data
    } catch (error: any) {
      console.log('THIS IS THE ERROR FROM THE MAIN ROOT: ', error)
      if (error.response && error.response.data) {
        return error.response.data
      }

      return {
        success: false,
        data: null as any,
        message: error.message || 'Network error',
      }
    }
  }

  // GET method
  public async get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
    })
  }

  // POST method
  public async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
    })
  }

  // PUT method
  public async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
    })
  }

  // PATCH method
  public async patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
    })
  }

  // DELETE method
  public async delete<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
      params,
    })
  }

  // Upload files method
  public async upload<T = any>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  // Download file method
  public async download(url: string, filename: string, params?: any): Promise<boolean> {
    try {
      const response = await this.instance.get(url, {
        params,
        responseType: 'blob',
      })

      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      return true
    } catch (error) {
      console.error('Download failed', error)
      return false
    }
  }
}

// Create and export default API client instance
const apiConfig: ApiClientConfig = {
  baseURL: (import.meta.env.VITE_API_BASE_URL || 'https://test.nsuk.edu.ng') + "/api",
}

export const apiClient = new ApiClient(apiConfig)
export default apiClient
