/** .kniprc.cjs */
module.exports = {
  patterns: ["**/*.{ts,tsx,js,jsx}"],
  ignorePatterns: [
    ".next/**",
    "node_modules/**",
    "public/**",
    "app/api/**",    // if you persist API routes that may seem “unused”
    "**/prisma/**",
  ],
  failOnUnused: true,
  detectUnusedExports: true,
}
