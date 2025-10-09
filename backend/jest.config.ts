module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleDirectories: ["node_modules"],
    moduleFileExtensions: ["ts", "js", "json"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    collectCoverage: true,
    coverageProvider: "v8",
    coverageReporters: ["json", "text", "lcov", "clover"],
    resetMocks: true,
    resetModules: true,
    moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/src/$1",
        "^test/(.*)$": "<rootDir>/test/$1",
    },
    coveragePathIgnorePatterns: ["/node_modules/", "<rootDir>/src/.*/types/", "<rootDir>/test/.*/mocks/"],
}
