import { dest, src, task } from 'gulp';

const remark = require('remark');
const remarkHtml = require('remark-html');
const remarkHighLight = require('remark-highlight.js');


task('remark-test', function () {
  const renderer = remark()
    .use(remarkHtml)
    .use(remarkHighLight);

  const output = renderer
    .processSync(`
# 测试标题
测试内容
### 测试子标题
测试子内容
### 代码演示

最简单的用法。
<!-- example(affix-basic) -->
可以获得是否固定的状态。
<!-- example(affix-fixed) -->
用  \`target\`  设置  \`tri-affix\`  需要监听其滚动事件的元素，默认为  \`window\` 。
<!-- example(affix-container) -->
\`\`\`ts
export class TestClass {
  public function abc() {
    echo "abc";
  }
}
\`\`\`
  `).toString();

  console.log(output);
});
