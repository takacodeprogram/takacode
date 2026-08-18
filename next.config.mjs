/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdf-parse et mammoth chargent des workers / assets a l'execution : les
  // bundler casse l'extraction de texte en serverless.
  serverExternalPackages: ["pdf-parse", "mammoth"]
};

export default nextConfig;
