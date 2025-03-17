// B:\GUVI\AITripPlanner\frontendDir\jest.config.js
export default {
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@react-leaflet/core|react-leaflet))",
  ],
  maxWorkers: 1,
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    "^leaflet/dist/leaflet\\.css$": "<rootDir>/__mocks__/leaflet.css.js",
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/stylemock.css.js",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
