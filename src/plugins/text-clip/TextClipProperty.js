import { LOAD, DEBOUNCE, SUBSCRIBE, SUBSCRIBE_SELF, IF } from "el/sapa/Event";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { variable } from 'el/sapa/functions/registElement';

export default class TextClipProperty extends BaseProperty {
  
  getTitle() {
    return this.$i18n('text.clip.property.title');
  }

  isFirstShow() {
    return false; 
  }

  getClassName() {
    return 'item'
  }

  getTools() {
    return `<div ref='$textClip'></div>`;
  }  

  [LOAD("$textClip")]() {
    var current = this.$selection.current || {};

    var clip = current['text-clip'] || ''
    return /*html*/`
      <object refClass="SelectEditor"  ref='$1' key='text-clip' icon="true" value="${clip}" options=${variable(['', 'text'])} onchange="changeSelect" />
    `;
  }

  [SUBSCRIBE_SELF('changeSelect')] (key, value) {
    this.emit('setAttributeForMulti', this.$selection.packByValue({ [key]: value }));        
  }

  get editableProperty() {
    return "text-clip"
  }

  [SUBSCRIBE('refreshSelection') + IF('checkShow')]() {
    this.refresh();
  }

}