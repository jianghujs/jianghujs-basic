"use strict";


// ========================================常用 require start===========================================
const Service = require("egg").Service;
const validateUtil = require("@jianghujs/jianghu/app/common/validateUtil");

const appDataSchema = {
  selectStudentList: {
    type: "object",
    required: ["pageId", "actionId"],
    properties: {
      pageId: { type: "string" },
      actionId: { type: "string" },
      authToken: { anyOf: [{ type: "string" }, { type: "null" }] },
      actionData: { type: "object" },
      where: { type: "object" },
    },
  },
};

class StudentService extends Service {
  // beforeHook: 生成学生 studentId
  async generateStudentId() {
    const maxStudentIdResult = await this.app
      .jianghuKnex("student")
      .max("studentId", { as: "maxStudentId" })
      .first();

    let newStudentId;
    if (!maxStudentIdResult.maxStudentId) {
      newStudentId = "S10001";
    } else {
      const maxStudentId = parseInt(maxStudentIdResult.maxStudentId.replace("S", ""))
      newStudentId = `S${maxStudentId + 1}`;
    }
    this.ctx.request.body.appData.actionData.studentId = newStudentId;
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
    const appData = this.ctx.request.body.appData;
    validateUtil.validate(
      appDataSchema.selectStudentList,
      appData
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
