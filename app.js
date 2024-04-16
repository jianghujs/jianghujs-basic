'use strict';
const jianghuKnexExample = require("./app/service/jianghuKnexExample");

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async serverDidReady() {
    // const ctx = this.app.createAnonymousContext();
    // ctx.service.jianghuKnexExample.callAll();
  }

}

module.exports = AppBootHook;

