import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/manage/api/:path*',
        destination: 'https://dev.hoola.vn/manage/api/:path*',
      },
    ];
  },
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
