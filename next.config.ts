import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  reactStrictMode: true,
  
  // Suppress hydration warnings for browser extension interference
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  // Experimental features to help with hydration
  experimental: {
    // Optimize hydration
    optimizePackageImports: ['react-icons', 'lucide-react'],
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // These modules are not available in the browser, so we provide fallbacks
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "util/types": false,
        "util": false,
        "fs": false,
        "net": false,
        "tls": false,
        "crypto": false,
        "stream": false,
        "url": false,
        "zlib": false,
        "http": false,
        "https": false,
        "assert": false,
        "os": false,
        "path": false,
        "mongodb": false,
        "bson": false,
        "kerberos": false,
        "@mongodb-js/zstd": false,
        "@aws-sdk/credential-providers": false,
        "gcp-metadata": false,
        "snappy": false,
        "socks": false,
        "aws4": false,
        "mongodb-client-encryption": false,
      };
      
      // Exclude MongoDB and related modules from client-side bundling
      config.externals = config.externals || [];
      config.externals.push('mongodb');
      config.externals.push('bson');
      config.externals.push('kerberos');
      config.externals.push('@mongodb-js/zstd');
      config.externals.push('@aws-sdk/credential-providers');
      config.externals.push('gcp-metadata');
      config.externals.push('snappy');
      config.externals.push('socks');
      config.externals.push('aws4');
      config.externals.push('mongodb-client-encryption');
    }
    
    return config;
  },
};

export default nextConfig;
