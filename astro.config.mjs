import { defineConfig } from 'astro/config';
import rehypeSlug from 'rehype-slug';
import { visit } from 'unist-util-visit';

function rehypeStripHeadingIds() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName) && node.children) {
        node.children.forEach((child) => {
          if (child.type === 'text') {
            const match = child.value.match(/\s*\{#([a-zA-Z0-9_-]+)\}/);
            if (match) {
              node.properties = node.properties || {};
              node.properties.id = match[1];
              child.value = child.value.replace(/\s*\{#[a-zA-Z0-9_-]+\}/, '');
            }
          }
        });
      }
    });
  };
}

export default defineConfig({
  site: 'https://uws.com.ua',
  output: 'static',
  build: {
    format: 'directory'
  },
  trailingSlash: 'never',
  markdown: {
    rehypePlugins: [rehypeStripHeadingIds],
  }
});
