import { defineConfig } from 'astro/config';

import react from "@astrojs/react";

const configIntegration = () => {
  return {
    name: 'project-name-vite-config',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            resolve: { alias: { 
              "react-native": "react-native-web",
             } }
          },
        });
      },
    },
  };
};
export default defineConfig({
  integrations: [react(), configIntegration()],
});