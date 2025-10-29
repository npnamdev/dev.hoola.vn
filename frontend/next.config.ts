import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/google-auth-callback',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: '' },
          { key: 'Cross-Origin-Embedder-Policy', value: '' },
        ],
      },
    ];
  },
};

export default nextConfig;
