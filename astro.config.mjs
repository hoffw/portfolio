// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://hoffmn.com',
  output: 'server',
  security: {
    checkOrigin: false,
    allowedDomains: [
      { hostname: "hoffmn.com" }
    ]
  },
  adapter: node({
    mode: 'standalone'
  })
});