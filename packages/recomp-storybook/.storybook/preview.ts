import type { Preview } from '@storybook/react';
import { themes } from '@storybook/theming';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
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
    },
  },
};

export default preview;
