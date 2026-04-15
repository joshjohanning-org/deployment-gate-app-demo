const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    app: "deployment-gate-app-demo",
    version: process.env.APP_VERSION || "unknown",
    commit: process.env.APP_COMMIT || "unknown",
    environment: process.env.APP_ENVIRONMENT || "local",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.get("/api/greeting", (req, res) => {
  const name = req.query.name || "World";
  res.json({ message: `Hello, ${name}!`, environment: process.env.APP_ENVIRONMENT || "local" });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// v4
// v7
