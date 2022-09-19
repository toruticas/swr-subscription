module.exports = {
  testEnvironment: "jsdom",
  testRegex: "/test/.*\\.test\\.tsx?$",
  modulePathIgnorePatterns: ["<rootDir>/examples/"],
  setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"],
  moduleNameMapper: {
    "^swr-subscription$": "<rootDir>/src/index.ts",
  },
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/", "/test/"],
  coverageReporters: ["text", "html"],
  reporters: ["default", "github-actions"],
};
