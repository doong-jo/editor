import { EVENT } from "../../../util/UIElement";
import { CLICK, LOAD } from "../../../util/Event";

import { Length } from "../../../editor/unit/Length";
import RangeEditor from "../property-editor/RangeEditor";
import SelectEditor from "../property-editor/SelectEditor";
import BasePopup from "./BasePopup";
import ColorViewEditor from "../property-editor/ColorViewEditor";
import { blend_list } from "../../../editor/util/Resource";



export default class PatternInfoPopup extends BasePopup {

  getTitle() {
    return this.$i18n('pattern.info.popup.title')
  }

  components() {
    return {
      RangeEditor,
      SelectEditor,
      ColorViewEditor,
    }
  }

  initState() {

    return {
      type: this.props.type || 'grid',
      x: this.props.x || Length.px(0),
      y: this.props.y || Length.px(0),
      width: this.props.width || Length.px(0),
      height: this.props.height || Length.px(0),
      lineWidth: this.props.lineWidth || Length.px(1),
      lineHeight: this.props.lineHeight || Length.px(1),
      foreColor: this.props.foreColor || 'black',
      backColor: this.props.backColor || 'transparent',
      blendMode: this.props.blendMode || 'normal'
    }
  }

  updateData(opt = {}) {
    this.setState(opt, false);

    const { x, y, width, height, foreColor, backColor, blendMode, lineWidth, lineHeight} = this.state; 

    this.state.instance.trigger(this.state.changeEvent, {
      x, y, width, height, foreColor, backColor, blendMode, lineWidth, lineHeight
    }, this.state.params);
  }


  [EVENT('changeRangeEditor')] (key, value) {
    this.updateData({ [key]: value });
  }

  templateForX() {
    if (this.hasNotX()) return '';      
    
    let label = 'X'
    let units = ''; 

    if (this.state.type === 'diagonal-line') {
      label = this.$i18n('pattern.info.popup.rotate')
      units = 'deg' 
    }

    return /*html*/`
      <div class='popup-item'>
        <RangeEditor 
            label="${label}"
            calc="false"            
            ref="$x" 
            key="x"
            value="${this.state.x}"
            min="0" max="1000" step="1"
            units="${units}"
            onchange="changeRangeEditor"
        />
      </div>
    `;
  }

  templateForY() {
    if (this.hasNotY()) return '';            
    return /*html*/`
      <div class='popup-item'>
        <RangeEditor 
            label="Y" 
            calc="false"       
            ref="$y" 
            key="y"
            value="${this.state.y}"            
            min="0" max="1000" step="1"
            onchange="changeRangeEditor"
        />
      </div>
    `;
  }

  templateForWidth() {

    return /*html*/`
    <div class='popup-item'>
      <RangeEditor 
          label="${this.$i18n('pattern.info.popup.width')}"   
          calc="false"             
          ref="$width" 
          key="width"
          value="${this.state.width}"          
          min="0" max="500" step="1" 
          onchange="changeRangeEditor"
      />
    </div>
    `;
  }

  templateForHeight() {
    return /*html*/`
    <div class='popup-item'>
      <RangeEditor 
          label="${this.$i18n('pattern.info.popup.height')}"
          calc="false"          
          ref="$height" 
          key="height"
          value="${this.state.height}"          
          min="0" max="500" step="1" onchange="changeRangeEditor"
      />
    </div>
    `;
  }

  hasNotLineWidth () {
    return ['check'].includes(this.state.type);
  }

  hasNotLineHeight () {
    return ['cross-dot', 'dot', 'check','diagonal-line', 'horizontal-line'].includes(this.state.type);
  }  

  hasNotX () {
    return ['grid', 'dot', 'horizontal-line'].includes(this.state.type);
  }    

  hasNotY () {
    return ['grid', 'dot', 'diagonal-line', 'vertical-line'].includes(this.state.type);
  }      

  templateForLineWidth() {

    if (this.hasNotLineWidth()) return '';    

    return /*html*/`
    <div class='popup-item'>
      <RangeEditor 
          label="${this.$i18n('pattern.info.popup.lineWidth')}"   
          calc="false"             
          ref="$lineWidth" 
          key="lineWidth"
          value="${this.state.lineWidth}"          
          min="0" max="500" step="1" 
          onchange="changeRangeEditor"
      />
    </div>
    `;
  }

  templateForLineHeight() {
    if (this.hasNotLineHeight()) return '';        
    return /*html*/`
    <div class='popup-item'>
      <RangeEditor 
          label="${this.$i18n('pattern.info.popup.lineHeight')}"
          calc="false"          
          ref="$lineHeight" 
          key="lineHeight"
          value="${this.state.lineHeight}"          
          min="0" max="500" step="1" onchange="changeRangeEditor"
      />
    </div>
    `;
  }  

  templateForForeColor() {
    return /*html*/`
      <div class='popup-item'>
        <ColorViewEditor 
            ref='$foreColor' 
            label="${this.$i18n('pattern.info.popup.foreColor')}" 
            key='foreColor' 
            value="${this.state.foreColor}"
            onchange="changeRangeEditor" />
      </div>
    `
  }

  templateForBackColor() {
    return /*html*/`
      <div class='popup-item'>
        <ColorViewEditor 
            ref='$backColor' 
            label="${this.$i18n('pattern.info.popup.backColor')}" 
            key='backColor' 
            value="${this.state.backColor}"
            onchange="changeRangeEditor" />
      </div>
    `
  }

  getBlendList () {
    return blend_list.split(',').map(it => {
        return `${it}:${this.$i18n(`blend.${it}`)}`
    }).join(',');
}  

  templateForBlendMode() {

    if (!this.state.blendListString) {
        this.state.blendListString = this.getBlendList();
    }


    return /*html*/`
    <div class='popup-item'>
      <SelectEditor 
            ref='$blend' 
            key='blendMode' 
            label="${this.$i18n('pattern.info.popup.blend')}"
            value="${this.state.blendMode}" 
            options="${this.state.blendListString}" 
            onchange="changeRangeEditor" 
        />
    </div>
    `;
}    

  getBody() {
    return /*html*/`
      <div class="background-image-position-picker" ref='$picker'></div>
    `;
  }

  [LOAD('$picker')] () {
    return /*html*/`
      
      <div class='box'>

        <div class='background-property'>      
          ${this.templateForWidth()}
          ${this.templateForHeight()}        
          ${this.templateForLineWidth()}
          ${this.templateForLineHeight()}                  
          ${this.templateForX()}
          ${this.templateForY()}
          ${this.templateForForeColor()}
          ${this.templateForBackColor()}
          ${this.templateForBlendMode()}
        </div>
      </div>
    `
  }


  [EVENT("showPatternInfoPopup")](data, params) {
    this.state.changeEvent = data.changeEvent || 'changePatternInfoPopup'
    this.state.params = params; 
    this.state.instance = data.instance; 

    this.setState(data.data);

    this.show(460);
  }


}