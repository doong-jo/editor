import BaseProperty from "./BaseProperty";
import { DEBOUNCE, SUBSCRIBE } from "el/base/Event";


import "../property-editor/OffsetPathListEditor";
import { registElement } from "el/base/registElement";


export default class MotionProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('motion.property.title');
  }

  [SUBSCRIBE('refreshSelection', 'refreshRect') + DEBOUNCE(100)]() {
    this.refreshShowIsNot(['project']);
  }

  refresh() {
    var current = this.$selection.current;
    if (current) {
      this.children.$offsetPathList.setValue(current['offset-path'])   
    }
  }

  getBody() {
    var current = this.$selection.current || {'offset-path': ''};
    return /*html*/`
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='offset-path'></span>
        </div>
        <object refClass="OffsetPathListEditor" ref="$offsetPathList" key="offset-path" value="${current['offset-path']}" onchange="changRangeEditor" />
      </div>
    `;
  }

  [SUBSCRIBE('changRangeEditor')] (key, value) {
    
    this.command('setAttribute', `change motion attribute : ${key}`, { 
      [key]: value 
    })

  }
}

registElement({ MotionProperty })