/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
  webpack(config) {
    // Add a rule to handle .node binary files with file-loader
    config.module.rules.push({
      test: /\.node$/,
      use: 'file-loader',
    });

    return config;
  },
};

export default nextConfig;
