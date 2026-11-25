const config = {
  // Server-side calls use the Vercel service binding (SERVER_URL), falling back to local Express port 3001
  get serverApiBaseUrl() {
    return (
      process.env.SERVER_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://127.0.0.1:3001"
    ).replace("://localhost:", "://127.0.0.1:");
  },
  // Client-side calls use same-origin relative URLs (/api/*) routed by Vercel rewrites (or Next.js local rewrites)
  get apiBaseUrl() {
    if (typeof window === "undefined") {
      return this.serverApiBaseUrl;
    }
    return "";
  },
  nextAuthUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
};

export default config;
