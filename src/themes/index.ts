import { reactive } from 'vue';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';

// Import custom theme overrides
import './fpn/theme.css';
import './lafia/theme.css';

// Theme configuration based on school
const themes = {
  fpn: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false
    }
  },
  lafia: {
    preset: Lara,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false
    }
  },
  // Default theme
  default: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false
    }
  }
};

// Get the school from environment variable
type SchoolKey = keyof typeof themes;
const school = (import.meta.env.VITE_SCHOOL || 'default') as SchoolKey;

// Export the selected theme configuration
export const themeConfig = reactive(themes[school] || themes.default);
