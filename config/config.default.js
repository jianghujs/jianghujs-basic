'use strict';

const path = require('path');

const { middleware, middlewareMatch } = require('@jianghujs/jianghu/config/middlewareConfig');

const eggJianghuPathResolve = require.resolve('@jianghujs/jianghu');
const eggJianghuPath = path.join(eggJianghuPathResolve, '../');

module.exports = appInfo => {

  const appId = 'jianghujs-basic';

  return {
    appId,
    appTitle: '江湖演示-初级',
    appLogo: `${appId}/public/img/logo.svg`,

    indexPage: `/${appId}/page/doUiAction`,
    loginPage: `/${appId}/page/login`,
    helpPage: `/${appId}/page/help`,

    uploadDir: path.join(appInfo.baseDir, 'upload'),
    downloadBasePath: `/${appId}/upload`,

    primaryColor: "#4caf50",
    primaryColorA80: "#EEF7EE",

    static: {
      dynamic: true,
      preload: false,
      maxAge: 31536000,
      buffer: true,
      dir: [
        { prefix: `/${appId}/public/`, dir: path.join(appInfo.baseDir, 'app/public') },
        { prefix: `/${appId}/public/`, dir: path.join(eggJianghuPath, 'app/public') },
      ],
    },

    view: {
      defaultViewEngine: 'nunjucks',
      mapping: { '.html': 'nunjucks' },
      root: [
        path.join(appInfo.baseDir, 'app/view'),
        path.join(eggJianghuPath, 'app/view'),
      ].join(','),
    },

    middleware,
    ...middlewareMatch,
  };

};
