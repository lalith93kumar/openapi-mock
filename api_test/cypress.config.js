const cucumber = require  ('cypress-cucumber-preprocessor').default;
const { defineConfig } = require("cypress");
var JsonRefs = require('json-refs');
const jsf = require("json-schema-faker");
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('file:preprocessor', cucumber())
      on('task', {
        getRef(sidebar) {
          return JsonRefs.resolveRefs(sidebar)
        }
      })
      on('task', {
        getFakeBody(schema) {
          return jsf.generate(schema)
        }
      })
    },
    baseUrl: 'http://localhost:8080/v1',
    specPattern: "cypress/e2e/*.feature",
  },
});
