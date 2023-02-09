'use strict';


// ========================================常用 require start===========================================
const Service = require('egg').Service;
const validateUtil = require("@jianghujs/jianghu/app/common/validateUtil");
const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");

const appDataSchema = Object.freeze({
  selectStudentList: {
    type: "object",
    additionalProperties: true,
    required: [],
    properties: {}
  },
});

class StudentService extends Service {
  // beforeHook: 生成学生 studentId
  async generateStudentId() {
    const tableName = "student";
    const columnName = "studentId";
    const studentId = await idGenerateUtil.idPlus({
      knex: this.app.jianghuKnex,
      tableName,
      columnName,
    });
    console.log('student_id----', studentId)
    this.ctx.request.body.appData.actionData.studentId = studentId;
  }

  // 数据权限方式一，beforeHook 配合 sql 动态数据进行查询
  // beforeHook：将学生信息加到 ctx.userInfo 中
  async appendStudentInfoToUserInfo() {
    const studentInfo = await this.app
      .jianghuKnex("student")
      .where({ studentId: this.ctx.userInfo.user.userId })
      .first();
    this.ctx.userInfo.studentInfo = studentInfo || { classId: null };
  }

  // 数据权限方式二，直接使用 service 实现
  // 获取同班学生列表
  async selectStudentList() {

    validateUtil.validate(
      appDataSchema.selectStudentList,
      actionData
    );

    const studentInfo = await this.app
      .jianghuKnex("student")
      .where({ studentId: this.ctx.userInfo.user.userId })
      .first();
    const studentList = await this.app
      .jianghuKnex("student")
      .where({ classId: studentInfo.classId })
      .select();

    return {
      rows: studentList
    };
  }
}

module.exports = StudentService;
