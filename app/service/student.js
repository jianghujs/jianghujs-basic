'use strict';


// ========================================常用 require start===========================================
const Service = require('egg').Service;
const validateUtil = require("@jianghujs/jianghu/app/common/vaidateUtil");
const dayjs = require("dayjs");
const { nanoid } = require("nanoid");

const actionDataScheme = Object.freeze({
  selectStudentList: {
    type: "object",
    additionalProperties: true,
    required: [],
    properties: {}
  },
});

class StudentService extends Service {
  // 生成学生 studentId
  async beforHookForGenerateStudentId() {
    const { actionData } = this.ctx.request.body.appData;
    const { dateOfBirth } = actionData;
    const dateOfBirthObj = dayjs(dateOfBirth);
    const studentId = `S_${nanoid.nanoid(8)}_${dateOfBirthObj.month()}_${dateOfBirthObj.day()}`;
    console.log('student_id----', studentId)
    this.ctx.request.body.appData.actionData.studentId = studentId;
  }

  // beforeHook：将学生信息加到 ctx.userInfo 中
  async appendStudentInfoToUserInfo() {
    const studentInfo = await this.app
      .jianghuKnex("student")
      .where({ studentId: this.ctx.userInfo.user.userId })
      .first();
    this.ctx.userInfo.studentInfo = studentInfo || { classId: null };
  }

  // 获取同班学生列表
  async selectStudentList() {

    validateUtil.validate(
      actionDataScheme.selectStudentList,
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
