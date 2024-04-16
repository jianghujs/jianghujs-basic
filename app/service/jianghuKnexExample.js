"use strict";


const Service = require("egg").Service;

class JianghuKnexExampleService extends Service {

    async callAll() {
        await this.select();
        await this.first();
        await this.count();
        await this.jhDelete();
        await this.jhInsert();
        await this.jhUpdate();
        await this.leftJoin();
        await this.offset();
    }

    async select() {
        const list = await this.app.jianghuKnex("student").where({}).select();
        this.app.logger.info('jianghuKnexExample.js select()', '=====>',`result length: ${list.length}`);
    }

    async first() {
        const student = await this.app.jianghuKnex("student").where({ studentId: 'S10001' }).first();
        this.app.logger.info('jianghuKnexExample.js first()', '=====>', { studentId: student?.studentId, name: student?.name });
    }

    async count() {
        const countResult = await this.app.jianghuKnex("student").where({}).count('* as count').first();
        this.app.logger.info('jianghuKnexExample.js count()', '=====>', countResult);
    }

    async jhDelete() {
        const student = { studentId: 'T00001' };
        await this.app.jianghuKnex("student", this.ctx)
            .where({ studentId: student.studentId })
            .jhDelete({ name: student.name });
        this.app.logger.info('jianghuKnexExample.js jhDelete()', '=====>', student);
    }

    async jhInsert() {
        const student = { studentId: 'T00001', name: '测试001' };
        await this.app.jianghuKnex("student", this.ctx).jhInsert(student);
        this.app.logger.info('jianghuKnexExample.js jhInsert()', '=====>', student);
    }

    async jhUpdate() {
        const student = { studentId: 'T00001', name: '测试同学001' };
        await this.app.jianghuKnex("student", this.ctx)
            .where({ studentId: student.studentId })
            .jhUpdate({ name: student.name });
        this.app.logger.info('jianghuKnexExample.js jhUpdate()', '=====>', student);
    }

    async leftJoin() {
        const classId = '2021-01级-01班';
        const list = await this.app.jianghuKnex("class", this.ctx)
            .leftJoin('student', 'class.classId', 'student.classId')
            .whereRaw('class.classId = ?', [classId])
            .select();
        this.app.logger.info('jianghuKnexExample.js leftJoin()', '=====>', `result length: ${list.length}`);
    }

    async offset() {
        const pageSize = 5;
        const pageNumber = 1;
        const list = await this.app.jianghuKnex("student")
            .offset((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .select();
        this.app.logger.info('jianghuKnexExample.js offset()', '=====>',`result length: ${list.length}`);
    }

    async transaction() {
        const student = { studentId: 'T00002', name: '测试002' };
        const classObj = { classId: '2021-07级-01班', className: '七年级一班' };
        await this.app.jianghuKnex.transaction(async trx => {
            // 删除
            await trx('student', this.ctx).jhDelete(student);
            await trx('class', this.ctx).jhDelete(classObj);
            // 新增
            await trx('student', this.ctx).jhInsert(student);
            await trx('class', this.ctx).jhInsert(classObj);
        });
        this.app.logger.info('jianghuKnexExample.js transaction()', '=====>', classObj);
    }
}

module.exports = JianghuKnexExampleService;
