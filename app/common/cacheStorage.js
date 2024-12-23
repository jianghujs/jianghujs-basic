'use strict';

class CacheStorage {
  constructor(app) {
    this.app = app;
    this.responseCallbacks = new Map();
    
    // 在构造函数中设置全局监听器
    this.app.messenger.on('storage:get:response', ({ key, value }) => {
      const callback = this.responseCallbacks.get(key);
      if (callback) {
        callback(value);
        this.responseCallbacks.delete(key);
      } else {
        console.log('[CacheStorage] No callback found for key:', key);
      }
    });
  }

  async get(key) {
    console.log('[CacheStorage] Getting key:', { key, pid: process.pid });
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.responseCallbacks.delete(key);
        this.app.logger.warn('[storage] Get timeout:', { key });
        reject(new Error('Get storage timeout'));
      }, 5000);

      this.responseCallbacks.set(key, (value) => {
        clearTimeout(timeout);
        resolve(value);
      });

      this.app.messenger.sendToAgent('storage:get', {
        key,
        from: process.pid,
      });
    });
  }

  async set(key, value) {
    console.log('[CacheStorage] Setting key:', { key, value, pid: process.pid });
    this.app.messenger.sendToAgent('storage:set', { key, value });
  }

  async expire(key, seconds) {
    console.log('[CacheStorage] Setting expire:', { key, seconds, pid: process.pid });
    this.app.messenger.sendToAgent('storage:expire', { key, seconds });
  }

  async del(key) {
    console.log('[CacheStorage] Deleting key:', { key, pid: process.pid });
    this.app.messenger.sendToAgent('storage:del', { key });
  }
}

module.exports = CacheStorage;
