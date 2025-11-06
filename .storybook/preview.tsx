import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";
import "../src/app/globals.css";
import { handlers } from "../src/mocks/handlers";

// Initialize MSW
initialize({
  onUnhandledRequest: "warn",
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    msw: {
      handlers,
    },
    nextjs: {
      appDirectory: true,
    },
  },
  loaders: [mswLoader],
  decorators: [
    (Story) => (
      <div style={{ padding: "3rem" }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
