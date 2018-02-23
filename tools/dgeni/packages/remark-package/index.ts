import { Package } from 'dgeni';
import { RenderMarkdown } from './service/render-markdown';

export const RemarkPackage = new Package('remark')
  .factory(function renderMarkdown() {
    const ins = new RenderMarkdown();
    return ins.markdown.bind(ins);
  });
