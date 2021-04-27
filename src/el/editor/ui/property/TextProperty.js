import BaseProperty from "./BaseProperty";

import { registElement } from "el/base/registElement";
import { SUBSCRIBE } from "el/base/Event";

export default class TextProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('text.property.title');
  }

  afterRender() {
    this.show();
  }

  [SUBSCRIBE('refreshSelection') ]() {
    this.refresh();
  }

  refresh() {
   // TODO: 데이타 로드를 어떻게 해야할까? 
    var current = this.$selection.current;
    if (current) {
      this.children.$align.setValue(current['text-align']);
      this.children.$transform.setValue(current['text-transform']);
      this.children.$decoration.setValue(current['text-decoration']);            
    }

  }

  getBody() {
    return /*html*/`
      <div class="property-item">
        <object refClass="SelectIconEditor" 
          ref='$align' 
          label='${this.$i18n('text.property.align')}' 
          key='text-align' 
          value='left' 
          options="left,center,right,justify" 
          icons="align_left,align_center,align_right,align_justify" 
          onchange='changeTextValue' />        
      </div>        
      <div class="property-item">
        <object refClass="SelectIconEditor" 
          ref='$transform' 
          label='${this.$i18n('text.property.transform')}' 
          key='text-transform' 
          options="none,uppercase:AG,lowercase:ag,capitalize:Ag"
          icons="horizontal_rule"
          onchange='changeTextValue' />                
      </div>        
      <div class="property-item">
        <object refClass="SelectIconEditor" 
          ref='$decoration' 
          label='${this.$i18n('text.property.decoration')}' 
          key='text-decoration' 
          options="none,underline,overline:O,line-through" 
          icons="horizontal_rule,underline,O,strikethrough"
          onchange='changeTextValue' />        
      </div>                    
    `
  }

  [SUBSCRIBE('changeTextValue')] (key, value) {

    this.command('setAttribute', `change text property : ${key}`, { 
      [key]: value
    })
  }

}

registElement({ TextProperty })