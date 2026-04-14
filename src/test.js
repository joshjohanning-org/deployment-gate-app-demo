// Simple test file
const assert = require("assert");

console.log("Running tests...");

// Test 1: App module loads
const app = require("./index.js");
assert(app, "App module should load");

console.log("All tests passed!");
process.exit(0);
