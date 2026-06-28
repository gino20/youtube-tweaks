import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'YouTube Always Show Controls',
        namespace: 'https://github.com/local/youtube-tweaks',
        description: 'Keeps YouTube video controls visible on watch pages, embeds, theater mode, miniplayer, and fullscreen.',
        match: [
          '*://www.youtube.com/*',
          '*://m.youtube.com/*',
          '*://www.youtube-nocookie.com/embed/*',
        ],
        'run-at': 'document-start',
        grant: 'none',
      },
    }),
  ],
});
