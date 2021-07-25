import { CLICK, DEBOUNCE, IF, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/base/Event";
import icon from "el/editor/icon/icon";
import BaseProperty from "el/editor/ui/property/BaseProperty";


export default class BoxShadowProperty extends BaseProperty {

  getTitle () {
    return this.$i18n('boxshadow.property.title');
  }

  getBody() {
    return /*html*/`
      <div class="full box-shadow-item" ref="$shadowList"></div>
    `;
  }

  hasKeyframe() {
    return true; 
  }

  [LOAD("$shadowList")]() {
    var current = this.$selection.current || {};
    return /*html*/`
      <object refClass="BoxShadowEditor" ref='$boxshadow' value="${current['box-shadow'] || ''}" hide-label="true" onChange="changeBoxShadow" />
    `
  }


  getTools() {
    return /*html*/`<button type="button" ref='$add'>${icon.add}</button>`
  }

  [CLICK('$add')] () {
    this.children.$boxshadow.trigger('add');
  }

  get editableProperty() {
    return 'box-shadow';
  }

  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100) + IF('checkShow')]() {
    this.refresh();

  }

  [SUBSCRIBE_SELF("changeBoxShadow")](boxshadow) {

    this.command('setAttributeForMulti', 'change box shadow', this.$selection.packByValue({ 
      'box-shadow': boxshadow
    }))

  }
}