
import {
  LOAD, DEBOUNCE, CLICK, SUBSCRIBE, SUBSCRIBE_SELF, DOMDIFF, IF,
} from "el/sapa/Event";


import icon from "el/editor/icon/icon";
import { Transform } from "el/editor/property-parser/Transform";
import BaseProperty from "el/editor/ui/property/BaseProperty";

var transformList = [

  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'rotate3d',    
  'skew',      
  'skewX',    
  'skewY',   
  'translate',
  'translateX',  
  'translateY',
  'translateZ',
  'translate3d',
  'perspective',    
  'scale',
  'scaleX',
  'scaleY',
  'scaleZ',
  'scale3d',
  'matrix',
  'matrix3d',  
];


export default class TransformProperty extends BaseProperty {

  isFirstShow() {
    return true; 
  }

  getTitle() {
    return this.$i18n('transform.property.title')
  }

  getBody() {
    return /*html*/`
      <object refClass="RotateEditorView" />
      <div class='full transform-property' ref='$body'></div>
    `;
  }

  hasKeyframe() {
    return true; 
  }

  getKeyframeProperty () {
    return 'transform'
  }

  getTools() {
    return /*html*/`
      <select ref="$transformSelect">
      ${transformList.map(transform => {
        var label = this.$i18n('css.item.' + transform)
        return `<option value='${transform}'>${label}</option>`;
      }).join('')}
      </select>
      <button type="button" ref="$add" title="add Filter">${icon.add}</button>
    `
  }
  

  [CLICK("$add")]() {
    var transformType = this.refs.$transformSelect.value;

    this.children.$transformEditor.trigger('add', transformType)
  }

  [LOAD('$body') + DOMDIFF] () {
    var current = this.$selection.current || {} 
    var value = current.transform;

    return /*html*/`
      <object refClass="TransformEditor" ref='$transformEditor' value='${value}' hide-label="true" onchange='changeTransformEditor' />
    `
  }

  [SUBSCRIBE_SELF('changeTransformEditor')] (transform) {
    this.command('setAttributeForMulti', 'change transform property', this.$selection.packByValue({ 
      transform
    }))

    this.nextTick(() => {
      this.emit('refreshSelectionTool', false);
    })
  }

  refresh () {
    this.children.$transformEditor.setValue(this.$selection.current.transform);
  }

  get editableProperty() {
    return 'transform';
  }

  [SUBSCRIBE('refreshSelection') + IF('checkShow')] () {
    this.refresh();
  }

  [SUBSCRIBE('refreshSelectionStyleView') + DEBOUNCE(100)] () {

    const current = this.$selection.current

    if (current) {

      if (current.hasChangedField('transform')) {
        this.refresh();
      }

    }

  }

}