# PrimeVue Theme Configuration System

This directory contains the theme configuration system for the portal frontend. The system is designed to load different themes based on the value of the `VITE_SCHOOL` environment variable.

## How It Works

The `index.ts` file in this directory exports a theme configuration object that is determined by the `VITE_SCHOOL` environment variable. The configuration includes:

- The PrimeVue theme preset (Aura, Lara, etc.)
- Theme options like prefix, dark mode selector, and CSS layer settings
- Custom CSS styles specific to each school

## Available Themes

Currently, the system supports the following schools:

- **fpn**: Uses the Aura preset with custom green and gold color scheme
- **lafia**: Uses the Lara preset with custom blue and red color scheme

## Theme Structure

Each school theme consists of:

- A directory named after the school (e.g., `fpn/`, `lafia/`)
- A `theme.css` file with custom CSS variables and component overrides

## Adding a New Theme

To add support for a new school:

1. Create a new directory with the school's identifier (matching the potential value in `VITE_SCHOOL`)
2. Add a `theme.css` file with the school's custom styling
3. Update the `themes` object in `index.ts` to include the new school configuration

## Environment Variable

The theme is determined by the `VITE_SCHOOL` environment variable. If this variable is not set or its value doesn't match any of the configured themes, the system will fall back to the default theme.

Example `.env` settings:
```
VITE_SCHOOL=fpn    # Use FPN theme
VITE_SCHOOL=lafia  # Use Lafia theme
```

## Customizing Themes

To customize a theme, edit the corresponding `theme.css` file. You can modify:

- CSS variables for colors, spacing, and other design elements
- Component-specific styles using PrimeVue's CSS classes
- Add custom classes for school-specific UI elements

## Usage in Components

No special imports are needed in your components. The theme is automatically applied at the application level in `main.ts`.