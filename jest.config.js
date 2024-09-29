export default {
  transform: {
    "^.+\\.m?js$": "babel-jest",
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ["js", "mjs", "cjs", "json", "node","ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testEnvironment: "node",
  clearMocks: true,
};
