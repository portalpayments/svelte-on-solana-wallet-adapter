import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-static";
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  onwarn: (warning, handler) => {
    if (warning.code === "a11y-click-events-have-key-events") {
      // Ignore accessibility warnings
      // TODO: fix properly
      return;
    }
    handler(warning);
  },

  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    adapter: adapter(),
    vite: {
      adapter: adapter(),
      resolve: {
        alias: {
          $lib: path.resolve("src/lib/"),
        },
      },
    },
  },
};

export default config;
