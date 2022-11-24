## 应用协议


* 不同端之间所传递的数据，江湖JS所做的规范与设计
* 应用协议的设计上，进行了统一和简化
* 能够做到在不同通讯通道间无缝切换

##  Resource请求

在江湖JS里，一个HTTP请求/Socket请求对应数据库`_resource`表中的一行数据。

**我们把请求resource 分成两类:**
- sql resource: 后端根据请求组装出sql，执行并将结果返回给前端
- service resource: 后端根据请求找出`/app/service`下对应的service，执行对应的方法并将结果返回给前端

## Resource请求 & Resource响应

- 请求: `/${appId}/resource`
- 请求方式: `POST`
- 请求头:
    - 'Content-Type': 'application/json'
    - 'Accept': 'application/json'
- 请求body
  >  where offset limit参数只有在 sql resource场景有用
  | 协议字段 | 类型 |  描述 |
  | --- | --- | --- |
  | packageId| String | 必填✅ 协议包的唯一id; 可以使用时间戳 + 随机数生成; 比如: 1622720431076_3905352 |
  | packageType | String |  必填✅ 协议包类型; 比如：'httpRequest', 'socketForward', 'socketRequest'|
  | appData | Object |  必填✅ 协议包数据 |
  | --appId | String | 必填✅ 应用ID; 比如: demo_xiaoapp |
  | --pageId | String | 必填✅ 页面ID; 比如: demoPage |
  | --actionId | String | 必填✅ 操作ID; 比如: selectStudentList |
  | --authToken | String | 必填✅ 用户令牌 |
  | --userAgent | String | 选填 客户端浏览器信息; 通过`window.navigator.userAgent` 获取 |
  | --where | Object | 选填 where条件; 比如: { name: '张三丰', classId: '2021-01级-02班' } |
  | --whereIn | Object | 选填 where in查询条件; 比如: { name: ['张三丰', '张无忌'] } |
  | --whereLike | Object | 选填 where 模糊查询条件; 比如: { name: '张' } |
  | --whereOptions | Array | 选填 where条件 ; 比如: [['name', '=', 'zhangshan'],['level', '>', 3],['name', 'like', '%zhang%']]|
  | --whereOrOptions | Array | 选填 where or 条件; 比如: [['name', '=', 'zhangshan'],['level', '>', 3],['a', 100]]|
  | --offset | Number | 选填 查询起始位置; 比如: 0 |
  | --limit | Number | 选填 查询条数，默认查所有; 比如: 10 |
  | --orderBy | Array | 选填 排序; 比如: [{ column: 'age', order: 'desc' }] |
  | --actionData | Object | 选填 操作数据，比如：要保存或更新的数据... { name: '张三丰', level: '03' } |
- 响应body
  > | 字段  | 类型 | 描述   |
  | ----    | ----  | ----  |
  | packageId | String | 必返回✅,请求唯一标识。 |
  | packageType | String     | 必返回✅,标识数据包类型; httpResponse, socketResponse|
  | status | String     | 必返回✅,标识业务状态; success: 成功, fail: 失败 |
  | timestamp  | String     | 必返回✅,响应时间, E.g: 2021-05-24 17:56:59,408" |
  | appData | Object     | 必返回✅, `sql resource` or `service resource` 执行后的结果 |
  | --appId | String | 必返回✅ 应用ID; 比如: demo_xiaoapp |
  | --pageId | String | 必返回✅ 页面ID; 比如: demoPage |
  | --actionId | String | 必返回✅ 操作ID; 比如: selectStudentList |
  | --errorCode | String     | 错误码, 当status==='fail'时返回, E.g: token_expired, request_body_invalid |
  | --errorReason | String     | 错误码说明, 当status==='fail'时返回, E.g: token失效, params字段字段却失 |
  | --errorReasonSupplement| String | 错误码说明 补充, E.g: "id must not be null" |
  | --resultData | Object       |必返回✅  resource请求的响应数据 |

### 参考用例

```javascript
const  package = {
  packageId: '123456',
  packageType: 'httpRequest',
  appData: {
    appId: `${window.appInfo.appId}`,
    pageId: 'protocolDemo',
    actionId: 'insertItem',
    userAgent: 'demo_userAgent',
    authToken: localStorage.getItem(`${window.appInfo.appId}_authToken`),
    actionData: {
      studentId: 'G00003',
      classId: '2021-01级-02班',
      gender: 'male',
      level: '02',
      name: '小虾米',
    },
    where: { 字段A: 'A', 字段B: 'B' },
    whereIn: { name: ['张三丰', '张无忌'] },
    whereLike: { 字段A: 'A', 字段B: 'B' },
    whereOptions: [['name', '=', 'zhangshan'],['level', '>', 3]],
    whereOrOptions: [['name', '=', 'zhangshan'],['level', '>', 3]],
    offset: 10,
    limit: 20,
    orderBy: [{ column: 'email' }, { column: 'age', order: 'desc' }],
  }
};
const result = await axios(package);
const rows = result.data.appData.resultData.rows;
console.log('rows', rows);
```

### jianghuAxios用例

```html
{% include 'common/jianghuAxios.html' %}

<script>
const result = await window.jianghuAxios({
  data: {
    appData: {
      pageId: 'protocolDemo',
      actionId: 'insertItem',
      actionData: {
        studentId: 'G00003',
        classId: '2021-01级-02班',
        gender: 'male',
        level: '02',
        name: '小虾米',
      }
    }
  }
});
const result = await axios(package);
const rows = result.data.appData.resultData.rows;
console.log('rows', rows);
</script>
```
