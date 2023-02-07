'use strict';


// ========================================常用 require start===========================================
const Service = require('egg').Service;
const dayjs = require("dayjs");
const nanoid = require("nanoid");

class StudentService extends Service {
  async beforHookForGenerateStudentId() {
    // 验证请求参数
    const { actionData } = this.ctx.request.body.appData;
    // 逻辑处理
    const { dateOfBirth } = actionData;
    const dateOfBirthObj = dayjs(dateOfBirth);
    const studentId = `S_${nanoid.nanoid(8)}_${dateOfBirthObj.month()}_${dateOfBirthObj.day()}`;
    console.log('student_id----', studentId)
    this.ctx.request.body.appData.actionData.studentId = studentId;
  }

  async appendStudentInfoToUserInfo() {
    const studentInfo = await this.app
      .jianghuKnex("student")
      .where({ studentId: this.ctx.userInfo.user.userId })
      .first();
    this.ctx.userInfo.studentInfo = studentInfo || { classId: null };
  }

  async selectStudentList() {
    const studentInfo = await this.app
      .jianghuKnex("student")
      .where({ studentId: this.ctx.userInfo.user.userId })
      .first();
    const studentList = await this.app
      .jianghuKnex("student")
      .where({ classId: studentInfo.classId })
      .select();

    return {
      rows: studentList,
    };
  }
}

module.exports = StudentService;
