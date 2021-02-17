const getDocument = () => (typeof document !== 'undefined' ? document : <Document>{});

export class BrowserSupportService {
  private scrollbar;

  get scrollbarWidth() {
    const document = getDocument();
    if (!this.scrollbar && document && document.createElement) {
      const div = document.createElement('div');
      div.style.cssText = 'overflow:scroll;overflow-x:hidden;zoom:1;clear:both;display:block';
      div.innerHTML = '&nbsp;';
      document.body.appendChild(div);
      this.scrollbar = div.offsetWidth - div.scrollWidth;
      document.body.removeChild(div);
    }
    return this.scrollbar;
  }
}
