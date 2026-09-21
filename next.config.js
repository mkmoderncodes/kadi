/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Add your production image host (S3/Cloudinary) here once you
      // switch lib/storage.ts away from local disk.
    ],
  },
};

module.exports = nextConfig;
