/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allows the frontend API routes to proxy/forward requests
  // to the Flask ML backend without CORS issues during build.
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
