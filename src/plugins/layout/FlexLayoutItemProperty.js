
import { DEBOUNCE, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/base/Event";

import { CSS_TO_STRING } from "el/base/functions/func";
import BaseProperty from "el/editor/ui/property/BaseProperty";

import './FlexLayoutItemProperty.scss';

export default class FlexLayoutItemProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('flex.layout.item.property.title');
  }

  getClassName() {
    return 'elf--flex-layout-item-property';
  }

  getLayoutOptions () {
    return this.variable(['none', 'auto', 'value'].map(it => {
        return {value: it, text: this.$i18n(`flex.layout.item.property.${it}`) }
    }));
  }

  getBody() {
    return /*html*/`
        <div class='property-item' ref='$body'></div>
      `;
  }  

  [LOAD('$body')] () {
    var current = this.$selection.current || { 'flex-layout-item' : 'none' }

    var valueType = current['flex-layout-item'] || 'none';

    var arr = [] 
    if (['none', 'auto'].includes(valueType) === false) {
      arr  = valueType.split(' ');
    }

    if (arr.length > 0) {
      valueType = 'value'
    }

    return /*html*/`
      <div class='layout-select'>
        <object refClass="SelectIconEditor" 
        ref='$layout' 
        key='layout' 
        icon="true" 
        value="${valueType}"
        options="${this.getLayoutOptions()}"  
        onchange="changeLayoutType" />
      </div>
      <div class='layout-list' ref='$layoutList' data-selected-value='${current.layout}'>
        <div data-value='none'></div>
        <div data-value='auto'></div>
        <div data-value='value'>
          <div class='value-item'>
            <object refClass="RangeEditor"  ref='$grow' label='${this.$i18n('flex.layout.item.property.grow')}' key="flex-grow" value="${arr[0]}" min='0' max='1' step='0.01' units=",auto" onchange='changeFlexItem' />
          </div>
          <div class='value-item'>
            <object refClass="RangeEditor"  ref='$shrink' label='${this.$i18n('flex.layout.item.property.shrink')}' key="flex-shrink" value="${arr[1]}" min='0' max='1' step='0.01' units=",auto" onchange='changeFlexItem' />
          </div>
          <div class='value-item'>
            <object refClass="RangeEditor"  ref='$basis' label='${this.$i18n('flex.layout.item.property.basis')}' key="flex-basis" value="${arr[2]}" min='0' units="px,em,%,auto" onchange='changeFlexItem' />
          </div>                    
        </div>
      </div>
    `
  }

  getFlexItemValue  (value) {
    return value.unit === 'auto' ? 'auto' : value + "";
  }

  getFlexValue () {

    var grow = this.children.$grow.getValue();
    var shrink = this.children.$shrink.getValue();
    var basis = this.children.$basis.getValue();

    grow = this.getFlexItemValue(grow);
    shrink = this.getFlexItemValue(shrink);
    basis = this.getFlexItemValue(basis);

    return CSS_TO_STRING({
      flex: `${grow} ${shrink} ${basis}`
    })
  }

  [SUBSCRIBE_SELF('changeFlexItem')] (key, value) {

    this.command('setAttributeForMulti', 'change flex layout', this.$selection.packByValue({ 
      'flex-layout-item': this.getFlexValue()
    }))

    this.nextTick(() => {
      this.emit('refreshAllElementBoundSize')    
    })
  }

  [SUBSCRIBE_SELF('changeLayoutType')] (key, value) {

    var valueType = this.children.$layout.getValue()
    var value = valueType;

    if (valueType === 'value') {
      value = this.getFlexValue()
    }

    this.command('setAttributeForMulti', 'change flex layout', this.$selection.packByValue({ 
      'flex-layout-item': value
    }))

    // 타입 변화에 따른 하위 아이템들의 설정을 바꿔야 한다. 
    this.refs.$layoutList.attr('data-selected-value', valueType);

    this.nextTick(() => {
      this.emit('refreshAllElementBoundSize')    
    })

  }

  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(() => {
      var current = this.$selection.current; 
      return  current && current.isInFlex()
    });
  }
}