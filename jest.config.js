module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: [
    '**/test/unit/*.test.tsx',
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
};
