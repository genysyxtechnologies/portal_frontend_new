/**
 * Utility class for working with URLs
 */
const urlUtil = {
  /**
   * Gets the query string part of a URL
   * @param url The URL to parse
   * @returns The query string part of the URL
   */
  getQuery(url: string): string | undefined {
    const query = url.split('?')[1]
    return query
  },

  getBaseUrl(): string {
    if (location.host.includes('localhost')) {
      return import.meta.env.VITE_API_BASE_URL
    }

    return location.host.startsWith('http') ? location.host : 'https://' + location.host
  },
}

export default urlUtil
