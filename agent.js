'use strict';

class AgentBootHook {
  constructor(agent) {
    agent.logger.info('Starting agent worker:', {
      pid: process.pid,
      type: agent.type,
      env: agent.config.env,
    });

    // 初始化存储
    this.storage = new Map();
    this.expireTimers = new Map();

    // 监听来自app worker的storage:get消息
    agent.messenger.on('storage:get', ({ key, from }) => {
      try {
        const value = this.storage.get(key);
        agent.logger.info('[storage:get]', { key, value, from });  
        agent.messenger.sendTo(from, 'storage:get:response', { key, value });
      } catch (error) {
        agent.logger.error('[storage:get] error:', error);
        agent.messenger.sendTo(from, 'storage:get:response', { key, value: null });
      }
    });

    // 监听来自app worker的storage:set消息
    agent.messenger.on('storage:set', ({ key, value }) => {
      try {
        this.storage.set(key, value);
        agent.logger.info('[storage:set]222#############', { key, value });  
      } catch (error) {
        agent.logger.error('[storage:set] error:', error);
      }
    });

    // 监听来自app worker的storage:expire消息
    agent.messenger.on('storage:expire', ({ key, seconds }) => {
      try {
        // 清除之前的定时器
        if (this.expireTimers.has(key)) {
          clearTimeout(this.expireTimers.get(key));
        }

        // 设置新的过期时间
        const timer = setTimeout(() => {
          try {
            this.storage.delete(key);
            this.expireTimers.delete(key);
            agent.logger.info('[storage:expire] key expired:', key);  
          } catch (error) {
            agent.logger.error('[storage:expire] cleanup error:', error);
          }
        }, seconds * 1000);

        this.expireTimers.set(key, timer);
        agent.logger.info('[storage:expire] set expire:', { key, seconds });  
      } catch (error) {
        agent.logger.error('[storage:expire] error:', error);
      }
    });

    // 监听来自app worker的storage:del消息
    agent.messenger.on('storage:del', ({ key }) => {
      try {
        // 清除过期定时器（如果存在）
        if (this.expireTimers.has(key)) {
          clearTimeout(this.expireTimers.get(key));
          this.expireTimers.delete(key);
        }
        // 删除存储的值
        this.storage.delete(key);
        agent.logger.info('[storage:del] key deleted:', key);
      } catch (error) {
        agent.logger.error('[storage:del] error:', error);
      }
    });

    // 每5分钟打印一次存储状态
    setInterval(() => {
      agent.logger.info('[storage] state:', {
        storageSize: this.storage.size,
        timersSize: this.expireTimers.size,
      });
    }, 5 * 60 * 1000);
  }

  async serverDidReady() {
  }

  async beforeClose() {
    for (const timer of this.expireTimers.values()) {
      clearTimeout(timer);
    }
    this.storage.clear();
    this.expireTimers.clear();
  }
}

module.exports = AgentBootHook;
