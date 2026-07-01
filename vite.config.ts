import { defineConfig, type Plugin } from "vite";
import monkey, { util } from "vite-plugin-monkey";
import AutoImport from "unplugin-auto-import/vite";

/**
 * Creates a build-only Vite plugin that removes standalone debug statements.
 */
function stripDebugStatementsPlugin(): Plugin {
  return {
    name: "strip-debug-statements",
    apply: "build",
    renderChunk(code) {
      return {
        code: code.replace(
          /^\s*(?:console\.[A-Za-z_$][\w$]*\([^;\n]*\);|debugger;)\s*$/gm,
          "",
        ),
        map: null,
      };
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  console.log(mode);
  return {
    plugins: [
      AutoImport({
        imports: [util.unimportPreset],
      }),
      monkey({
        entry: "src/main.ts",

        server: { mountGmApi: true },
        userscript: {
          name: "YouTube Tweaks",
          namespace: "https://github.com/gino20/youtube-tweaks",
          description: "Keeps YouTube video controls visible",
          supportURL: "https://github.com/gino20/youtube-tweaks/issues",
          homepageURL: "https://github.com/gino20/youtube-tweaks",
          match: [
            "*://www.youtube.com/*",
            "*://m.youtube.com/*",
            "*://www.youtube-nocookie.com/embed/*",
          ],
          "run-at": "document-start",
          grant: "none",
        },
      }),
      ...(isProd ? [stripDebugStatementsPlugin()] : []),
    ],
  };
});
