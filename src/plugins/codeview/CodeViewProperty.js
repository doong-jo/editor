import { LOAD, DEBOUNCE, DOMDIFF, SUBSCRIBE, IF } from "el/base/Event";

import BaseProperty from "el/editor/ui/property/BaseProperty";

import './CodeViewProperty.scss';

export default class CodeViewProperty extends BaseProperty {
  getTitle() {
    return this.$i18n('code.view.property.title');
  }

  checkParentTab() {
    return this.parent.state.selectedIndexValue === 'code'
  }

  [SUBSCRIBE('refreshSelectionStyleView', 'refreshSelection') + IF('checkParentTab')]() {
    this.refresh();
  }

  getBody() {
    return `
      <div class="property-item elf--code-view-item" ref='$body'></div>
    `;
  }

  [LOAD('$body') + DOMDIFF] () {
    return [

      // todo: this.$renderer.getRenderer('html').codeview(this.$selection.current);
      this.$editor.html.codeview(this.$selection.current),
      // this.$editor.svg.codeview(this.$selection.current)
    ]
  }
}
