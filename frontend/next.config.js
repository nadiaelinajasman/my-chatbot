/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {},
  publicRuntimeConfig: {},
  // Custom dev server port
  devIndicators: {
    port: 5990,
  },
};

module.exports = nextConfig;
