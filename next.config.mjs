//import nextPWA from "next-pwa";
// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
//!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));
/*
const withPWA = nextPWA({
  dest: "public",
});
*/

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: { domains: ["localhost", "niniyeto.ir"] },
};
//export default withPWA(config);
export default config;
