# webR Console

We started with the example from web-R https://github.com/georgestagg/webr-vue-example.  It has several enhancements:

* Use latest `0.4.0` of web-R.
* Other tooling dependencies are upgraded.
* Use [PrimeVue](https://primevue.org) UI Component library. 
* Additional configuration of ACE editor (see below).
* Support multiple plots.
* Plots appear in a Gallery UI, with full-page image preview.

TypeScript source code showing how to load webR so that it can be accessed globally in any component is in `src/main.ts`. The primary webR Console component is in `src/components/WebREditor.vue`.

This application consists of 3 panels:

* [Ace code editor](https://ace.c9.io/) Panel.
  * Write R code in the editor, and click "Run". Results are shown in the Output Panel.
* Output panel for R output.
* Plot panel with a Gallery UI for plots. Plots are rendered using webR's built in `canvas()` graphics device.
  * Panel is hidden until plots are generated.

## Example Deployment

This example has been deployed to our website: https://escape-technology-llc.com/webr-console/index.html.

## Further information

The project configuration in `vite.config.ts` has been set up so that the app is served with the recommended cross-origin isolation headers set during development. The same HTTP headers should be set on the hosting web server once the application has been build and deployed to production. In this example, a Netlify configuration file at `netlify.toml` has been used to set the headers.

In addition, fallback worker scripts have been placed in the `public` folder so that if the page is not cross-origin isolated, webR will instead fall back to using a service worker for channel communication. Further information about cross-origin isolation and serving pages with webR can be found in the [webR documentation](https://docs.r-wasm.org/webr/latest/serving.html).

## Project Setup

First, clone this repo and `cd` into the new directory. Then run,

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
