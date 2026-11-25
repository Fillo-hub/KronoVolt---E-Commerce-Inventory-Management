/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      "@/components",
      "react-icons",
      "react-icons/fa6",
      "react-icons/fa",
      "react-icons/md",
      "react-icons/fc",
      "@headlessui/react",
      "flowbite-react",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
      },
    ],
  },
  async rewrites() {
    // When running standalone `next dev` outside Vercel, proxy non-Next.js /api/* routes to local Express server
    if (!process.env.VERCEL && !process.env.SERVER_URL) {
      const target = (
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:3001"
      ).replace("://localhost:", "://127.0.0.1:");
      return [
        {
          source: "/api/:path((?!auth|register).*)",
          destination: `${target}/api/:path*`,
        },
      ];
    }
    return [];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
