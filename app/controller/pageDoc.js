'use strict';

const send = require('koa-send');
const _ = require('lodash');
const Controller = require('egg').Controller;

class PageDocController extends Controller {

  async index() {
    const { ctx } = this;
    // 如果有传指定 pageId，则渲染 single.html
    const { pageId } = this.ctx.query;
    await ctx.render('pageDoc/index.html');
  }

  async sidebar() {
    // todo delete
  }

  async page() {
    const { ctx } = this;
    const pageDocFileName = ctx.params.pageDocFileName.replace(/\.md$/, '');
    try {
      await send(ctx, pageDocFileName + '.md', { root: ctx.app.config.baseDir + '/app/view/pageDoc' });
    } catch (e) {
      this.ctx.body = '*(Please add markdown file in /app/view/pageDoc)*';
    }
  }


}

module.exports = PageDocController;
