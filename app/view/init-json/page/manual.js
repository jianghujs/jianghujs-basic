/* eslint-disable */
const content = {
  pageType: "jh-page", pageId: "manual", table: "_user", pageName: "操作手册",
  resourceList: [],
  includeList: [],
  headContent: [
    { tag: 'jh-page-title', value: "操作手册", attrs: { cols: 12, sm: 6, md: 4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
  ],

  pageContent: [
    {
      tag: 'v-col',
      attrs: { cols: 12, class: 'pa-0' },
      value: [
        /*html*/`
        <iframe  style="border: 0; height: calc(100vh - 116px);" :src="'/' + appInfo.appId + '/pageDoc'" width="100%" height="100%"></iframe>
        `
      ]
    }
  ],
  actionContent: [

  ],
  common: {
    data: {},
    dataExpression: {
      appInfo: 'window.appInfo',
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {}
  },
  style: `
    .jh-page-doc-container {
      height: calc(100vh - 116px);
    }
  `
}

module.exports = content;