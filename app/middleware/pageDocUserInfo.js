'use strict';

const range = require('koa-range');
const send = require('koa-send');
const fs = require('fs');
const userInfoUtil = require('@jianghujs/jianghu/app/middleware/middlewareUtil/userInfoUtil');

module.exports = options => {
  return async (ctx, next) => {

    const { jianghuKnex, logger, db, config } = ctx.app;
    const { appId, appType, jianghuConfig = {} } = config;

    // 由于 userInfoUtil 针对的是 post 请求，所以需要构造一个结构一致的 body
    const mockBody = {
      appData: {
        authToken: ctx.cookies.get(`${appId}_authToken`, {
          httpOnly: false,
          signed: false,
        }),
      },
    };

    // 捕获 userInfo: { user, userGroupRoleList, allowPageList, userAppList } 到 ctx.userInfo
    ctx.userInfo = await userInfoUtil.getUserInfo({ config, body: mockBody, jianghuKnex, db, logger, appType });

    if (ctx.userInfo && ctx.userInfo.user && Object.keys(ctx.userInfo.user).length) {
      // md 文件中，对资源链接做特殊处理，将 ![](./xxx) 转成 ![]()
      if (ctx.path.endsWith('.md') && !ctx.path.endsWith('_sidebar.md')) {
        const filePath = ctx.path.replace(`/${config.appId}/pageDoc/`, '')
        const content = fs.readFileSync(config.baseDir + '/app/view/pageDoc/' + filePath)
        ctx.body = new String(content).replace(/]\(\.\/([^)]+?)(?<!\.md)\)/g, `](${ctx.request.origin}/${config.appId}/pageDoc/$1)`)
        return
      }

      // 兼容 /upload 开头的配置
      if (ctx.path.startsWith(`/${config.appId}/pageDoc/`)) {
        await send(ctx, decodeURI(ctx.path.replace(`/${config.appId}/pageDoc/`, '')), {
          root: config.baseDir + '/app/view/pageDoc',
          maxage: jianghuConfig.uploadFileMaxAge || 0,
        });
      }
    } else {
      ctx.redirect(ctx.app.config.loginPage || '/');
    }
    return range(ctx, next);
  };
};

