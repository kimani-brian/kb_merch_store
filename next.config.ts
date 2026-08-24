import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "odoo19",
        port: "8069",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8884",
      },
    ],
  },
};

export default nextConfig;
