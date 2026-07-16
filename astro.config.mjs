// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://uws.com.ua',
  output: 'static',
  build: {
    format: 'directory'
  },
  trailingSlash: 'never'
});
