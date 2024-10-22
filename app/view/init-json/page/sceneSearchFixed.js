const content = {
  pageType: "jh-page", pageId: "sceneSearchFixed", pageName: "场景搜索", version: 'v2',
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      desc: "✅查询列表-student",
      resourceData: { table: "student", operation: "select" }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      desc: "✅添加-student",
      resourceHook: { before: [{service: 'common', serviceFunction: 'generateBizIdOfBeforeHook'}] },
      resourceData: { table: "student", operation: "jhInsert" }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      desc: "✅更新-student",
      resourceData: { table: "student", operation: "jhUpdate" }
    },
    {
      actionId: "deleteItem",
      resourceType: "sql",
      desc: "✅删除-student",
      resourceData: { table: "student", operation: "jhDelete" }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "服务端搜索", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
    { 
      tag: 'jh-scene', 
      attrs: { showActionBtn: false },
    }
  ],
  pageContent: [
    {
      tag: 'jh-table',
      attrs: { 
        serverPagiation: true,
      },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        { tag: 'v-btn', value: '新增', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("startCreateItem")', small: true } },
        { tag: 'v-spacer' },
        // 默认筛选
        {
          tag: 'v-col',
          attrs: { cols: '12', sm: '6', md: '3', xs: 8, class: 'pa-0' },
          value: [
            { tag: 'v-text-field', attrs: {prefix: '筛选', 'v-model': 'searchInput', class: 'jh-v-input', ':dense': true, ':filled': true, ':single-line': true} },
          ],
        }
      ],
      headers: [
        {text: "学生ID", value: "studentId", width: 80},
        {text: "班级ID", value: "classId", width: 140},
        {text: "学生名字", value: "name", width: 120},
        {text: "年级", value: "level", width: 120, formatter: `
          {{ getDisplayText({displayObj: constantObj.level, displayValue: item.level}) }}
          `},
        {text: "性别", value: "gender", width: 120, formatter: `
          {{ getDisplayText({displayObj: constantObj.gender, displayValue: item.gender}) }}
          `},
        {text: "出生日期", value: "dateOfBirth", width: 120},
        {text: "身高", value: "bodyHeight", width: 120},
        {text: "学生状态", value: "studentStatus", width: 120},
        {text: "备注", value: "remarks", width: 120},
        {text: "操作者", value: "operationByUser", width: 120},
        {text: "操作时间", value: "operationAt", width: 250},
        {text: '操作', value: 'action', align: 'center', sortable: false, width: 'window.innerWidth < 500 ? 80 : 120', class: 'fixed', cellClass: 'fixed'},

        // width 表达式需要使用字符串包裹
      ],
      value: [
        // vuetify table custom slot
      ],
      rowActionList: [
        { text: '编辑', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' }, // 简写支持 pc 和 移动端折叠
        { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' } // 简写支持 pc 和 移动端折叠
      ],
    }
  ],
  actionContent: [
    {
      tag: 'jh-create-drawer',
      key: "create",
      attrs: {},
      title: '新增',
      headSlot: [
        { tag: 'v-spacer'}
      ],
      contentList: [
        { 
          label: "新增", 
          type: "form", 
          formItemList: [
            /**
             * colAtts: { cols: 12, md: 3 } // 表单父容器栅格设置
             * attrs: {} // 表单项属性
             */
            { label: "学生ID", model: "studentId", tag: "v-text-field", quickAttrs: ['disabled'], attrs: { placeholder: '自动生成'}, idGenerate: {
              prefix: 'S',
              bizId: 'studentId',
              startValue: '1000',
            }  },
            { label: "学生名字", model: "name", tag: "v-text-field", rules: "validationRules.requireRules",   },
            { label: "性别", model: "gender", tag: "v-select", rules: "validationRules.requireRules", attrs: { ':items': 'constantObj.gender'}   },
            { label: "出生日期", model: "dateOfBirth", tag: "v-date-picker", rules: "validationRules.requireRules",   },
            { label: "班级ID", model: "classId", tag: "v-select", rules: "validationRules.requireRules", attrs: { ':items': 'constantObj.classId'}    },
            { label: "年级", model: "level", tag: "v-select", rules: "validationRules.requireRules", attrs: { ':items': 'constantObj.level'}    },
            { label: "身高", model: "bodyHeight", tag: "v-text-field", rules: "validationRules.requireRules",   },
            { label: "学生状态", model: "studentStatus", tag: "v-select", rules: "validationRules.requireRules", attrs: { ':items': 'constantObj.studentStatus'}   },
            { label: "备注", model: "remarks", tag: "v-textarea", colAttrs: { md: 12}   },

          ], 
          action: [{
            tag: "v-btn",
            value: "新增",
            attrs: {
              color: "success",
              ':small': true,
              '@click': "doUiAction('createItem')"
            }
          }],
        },

      ]
    },
    {
      tag: 'jh-update-drawer',
      key: "update",
      attrs: {},
      title: '编辑',
      headSlot: [
        { tag: 'v-spacer'}
      ],
      contentList: [
        { 
          label: "编辑", 
          type: "form", 
          formItemList: [
            /**
             * colAtts: { cols: 12, md: 3 } // 表单父容器栅格设置
             * attrs: {} // 表单项属性
             */
            { label: "学生ID", model: "studentId", tag: "v-text-field", quickAttrs: ['disabled'] },
            { label: "学生名字", model: "name", tag: "v-text-field", rules: "validationRules.requireRules",   },
            { label: "性别", model: "gender", tag: "v-select", rules: "validationRules.requireRules", attrs: { ':items': 'constantObj.gender'}   },
            { label: "出生日期", model: "dateOfBirth", tag: "v-date-picker", rules: "validationRules.requireRules",   },
            { label: "班级ID", model: "classId", tag: "v-select", rules: "validationRules.requireRules", attrs: { ':items': 'constantObj.classId'}    },
            { label: "年级", model: "level", tag: "v-select", rules: "validationRules.requireRules", attrs: { ':items': 'constantObj.level'}    },
            { label: "身高", model: "bodyHeight", tag: "v-text-field", rules: "validationRules.requireRules",   },
            { label: "学生状态", model: "studentStatus", tag: "v-select", rules: "validationRules.requireRules", attrs: { ':items': 'constantObj.studentStatus'}   },
            { label: "备注", model: "remarks", tag: "v-textarea", colAttrs: { md: 12}   },

          ], 
          action: [{
            tag: "v-btn",
            value: "编辑",
            attrs: {
              color: "success",
              ':small': true,
              '@click': "doUiAction('updateItem')"
            }
          }],
        },
      ]
    },
    
  ],
  includeList: [], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    
    data: {
      constantObj: {
        gender: [{"value": "male", "text": "男"}, {"value": "female", "text": "女"}],
        level: [{"value": "01", "text": "一年级"}, {"value": "02", "text": "二年级"}, {"value": "03", "text": "三年级"}],
        classId: [
          {"value": "2021-01级-01班", "text": "2021-01级-01班"}, {"value": "2021-01级-02班", "text": "2021-01级-02班"},
          {"value": "2021-02级-01班", "text": "2021-02级-01班"}, {"value": "2021-02级-02班", "text": "2021-02级-02班"},
          {"value": "2021-03级-01班", "text": "2021-03级-01班"}, {"value": "2021-03级-02班", "text": "2021-03级-02班"}
        ],
        studentStatus: [{"value": "正常", "text": "正常"}, {"value": "退学", "text": "退学"}]
      },
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      serverSearchWhereLike: { className: '' }, // 服务端like查询
      serverSearchWhere: { }, // 服务端查询
      serverSearchWhereIn: { }, // 服务端 in 查询
      filterMap: {}, // 结果筛选条件

      currentSceneId: 'scene-fixed-all',
      defaultSceneList: [
        {"form": {}, "name": "全部", "id": "scene-fixed-all", system: true},
        {"form": {"level": "01", "gender": "male"}, "name": "一年级的男生", "id": "scene-fixed-1", system: true},
        {"form": {"level": "02", "gender": "female"}, "name": "二年级的女生", "id": "scene-fixed-2", system: true},
      ],

    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
   
    watch: {},
    computed: {
      tableDataComputed() {
        if(this.filterMap) {
          return this.tableData.filter(row => {
            for (const key in this.filterMap) {
              if (this.filterMap[key] && row[key] !== this.filterMap[key]) {
                return false;
              }
            }
            return true;
          });
        } else {
          return this.tableData;
        }
      },
    },
    doUiAction: {}, // 额外uiAction { [key]: [action1, action2]}
    methods: {}
  },
  
};

module.exports = content;
