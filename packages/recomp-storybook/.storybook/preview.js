import {themes} from '@storybook/theming';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'dark',
    values: [
      { name: 'dark', value: '#2f2f2f' },
      { name: 'light', value: '#f8f8f8' },
    ],
  },
  docs: {
    theme: themes.dark,
  }
}
