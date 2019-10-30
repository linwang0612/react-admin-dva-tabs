/**
 * 导出src目录下所有命名包含model.js的文件
 * 注意小写
 */

const context = require.context('../', true, /.model.js$/);

export default context.keys().map(key => context(key));
