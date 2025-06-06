import { reactive } from 'vue'
import Aura from '@primeuix/themes/aura'
import Lara from '@primeuix/themes/lara'

// Import custom theme overrides - dynamically done in the configuration section
// Do not import theme CSS files here to avoid applying all themes regardless of configuration

// Theme configuration based on school
const themes = {
  fpn: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
  lafia: {
    preset: Lara,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
  // Default theme
  default: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
}

// Get the school from environment variable
type SchoolKey = keyof typeof themes
const school = (import.meta.env.VITE_SCHOOL || 'default') as SchoolKey

// Adding console log to debug theme loading
// console.log('Loading theme for school:', school)

// Dynamically import the theme CSS
if (school === 'fpn') {
  import('./fpn/theme.css')
} else if (school === 'lafia') {
  import('./lafia/theme.css')
} else {
  // Default theme
  import('./fpn/theme.css')
}
// Export the selected theme configuration
export const themeConfig = reactive(themes[school] || themes.default)
