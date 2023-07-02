module.exports = {
  sets: {
    desktop: {
      files: "test/hermione",
    },
  },
  browsers: {
    chrome: {
      automationProtocol: "webdriver",
      retry:2,
      desiredCapabilities: {
        browserName: "chrome",
      },
    },
  },
  plugins: {
    "html-reporter/hermione": {
      enabled: true,
    },
  },
};
