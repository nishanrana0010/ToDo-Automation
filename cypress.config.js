const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
projectId: "p4huj4",
    baseUrl: "http://192.168.88.52:8070/web",
"viewportWidth": 1280,
  "viewportHeight": 800,

    setupNodeEvents(on, config) {
      // Ignore cross-origin script errors globally
     
    },
  },
});