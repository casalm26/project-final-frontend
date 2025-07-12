# Configuration Files

This directory contains all configuration files for the frontend application.

## Files Overview

| File                 | Purpose                                                     | Documentation                                                       |
| -------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| `.eslintrc.js`       | ESLint configuration for code quality and style enforcement | [ESLint Docs](https://eslint.org/docs/user-guide/configuring/)      |
| `.prettierrc`        | Prettier configuration for code formatting                  | [Prettier Docs](https://prettier.io/docs/en/configuration.html)     |
| `tailwind.config.js` | Tailwind CSS configuration and design tokens                | [Tailwind Docs](https://tailwindcss.com/docs/configuration)         |
| `postcss.config.js`  | PostCSS configuration for CSS processing                    | [PostCSS Docs](https://postcss.org/)                                |
| `vitest.config.js`   | Vitest configuration for testing                            | [Vitest Docs](https://vitest.dev/config/)                           |
| `lighthouserc.json`  | Lighthouse CI configuration for performance monitoring      | [Lighthouse CI Docs](https://github.com/GoogleChrome/lighthouse-ci) |

## Usage

Most tools automatically detect their config files in this directory through explicit references in:

- `package.json` scripts
- `vite.config.js`
- GitHub Actions workflow

## Notes

- Paths in config files are relative to the project root, not the config directory
- Changes to these files may require restarting development servers
- All configs follow the project's ESLint and Prettier rules
