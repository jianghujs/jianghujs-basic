'use strict';

const CacheStorage = require('./app/common/cacheStorage');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configDidLoad() {
    // 注册 CacheStorage
    this.app.cacheStorage = new CacheStorage(this.app);
  }

  async serverDidReady() {
  }
}

module.exports = AppBootHook;
