import axios from 'axios';

/**
 * Logo types supported by the application
 */
export enum LogoType {
  FULL = 'full',       // Full logo with text and icon
  ICON = 'icon',       // Icon only
  TEXT = 'text',       // Text only
  MONOCHROME = 'mono'  // Monochrome version
}

/**
 * Cached logo URLs to avoid repeated API calls
 */
const logoCache = new Map<string, string>();

/**
 * Service for handling logo operations throughout the application
 */
export const logoService = {
  /**
   * Fetch a logo from the API
   * @param type The type of logo to fetch
   * @returns Promise with the URL to the logo
   */
  async fetchLogo(type: LogoType = LogoType.FULL): Promise<string> {
    const cacheKey = `logo-${type}`;

    // Check if we have a cached version
    if (logoCache.has(cacheKey)) {
      return logoCache.get(cacheKey)!;
    }

    try {
      const response = await appClient.get(`/api/global/logo/${type}`, {
        responseType: 'blob'
      });

      const logoUrl = URL.createObjectURL(response.data);

      // Cache the URL
      logoCache.set(cacheKey, logoUrl);

      return logoUrl;
    } catch (error) {
      console.error(`Failed to fetch ${type} logo:`, error);
      throw error;
    }
  },

  /**
   * Get a base64 data URL for a logo
   * @param type The type of logo to get
   * @returns Promise with the base64 data URL
   */
  async getLogoDataUrl(type: LogoType = LogoType.FULL): Promise<string> {
    try {
      const response = await axios.get(`/api/global/logo/${type}`, {
        responseType: 'blob'
      });

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(response.data);
      });
    } catch (error) {
      console.error(`Failed to get ${type} logo data URL:`, error);
      throw error;
    }
  },

  /**
   * Clear the logo cache
   * @param type Optional specific logo type to clear, if not provided clears all
   */
  clearCache(type?: LogoType): void {
    if (type) {
      const cacheKey = `logo-${type}`;
      if (logoCache.has(cacheKey)) {
        URL.revokeObjectURL(logoCache.get(cacheKey)!);
        logoCache.delete(cacheKey);
      }
    } else {
      // Clear all cached logos
      logoCache.forEach(url => URL.revokeObjectURL(url));
      logoCache.clear();
    }
  },

  /**
   * Get the fallback URL for a logo when API fails
   * @param type The type of logo
   * @returns The URL to the fallback asset
   */
  getFallbackUrl(type: LogoType = LogoType.FULL): string {
    switch (type) {
      case LogoType.FULL:
        return '/fallback/logo-full.png';
      case LogoType.ICON:
        return '/fallback/logo-icon.png';
      case LogoType.TEXT:
        return '/fallback/logo-text.png';
      case LogoType.MONOCHROME:
        return '/fallback/logo-mono.png';
      default:
        return '/fallback/logo-full.png';
    }
  }
};
