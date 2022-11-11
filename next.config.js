const withPlugins = require("next-compose-plugins");
const withSvgr = require("next-svgr");
const withPWA = require("next-pwa");

module.exports = withPlugins([
  {
    distDir: "build",
    reactStrictMode: true,
  },
  [
    withPWA,
    {
      pwa: {
        disable: process.env.NODE_ENV === "development",
        dest: "public",
        register: true,
        sw: "/sw.js",
      },
    },
  ],
  withSvgr,
  // your other plugins here
]);
