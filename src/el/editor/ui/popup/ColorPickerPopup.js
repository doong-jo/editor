import UIElement, { EVENT } from "el/base/UIElement";
import BasePopup from "./BasePopup";
import "../property-editor/EmbedColorPicker";
import { LOAD, CLICK, SUBSCRIBE } from "el/base/Event";
import { registElement } from "el/base/registElement";

export default class ColorPickerPopup extends BasePopup {

  getTitle() {
    return this.$i18n('colorpicker.popup.title')
  }

  getClassName() {
    return 'compact'
  }

  initState() {

    return {
      color: 'rgba(0, 0, 0, 1)'
    }
  }


  updateData(opt = {}) {
    this.setState(opt, false);

    if (this.state.target) {
      this.state.target.trigger(this.state.changeEvent, this.state.color, this.params);
    }

  }

  updateEndData(opt = {}) {
    this.setState(opt, false);

    if (this.state.target) {
      this.state.target.trigger(this.state.changeEndEvent, this.state.color, this.params);
    }

  }

  getBody() {
    return /*html*/`
      <div class="color-picker-popup">
        <div class='box'>
          <object refClass="EmbedColorPicker" ref='$color' value='${this.state.color}' onchange='changeColor' onchangeend="changeEndColor" />
        </div>
      </div>
    `;
  }

  [LOAD('$projectColors')] () {
    var project = this.$selection.currentProject || {colors: []};

    var colors = project.colors

    return colors.map(color => {
      return /*html*/`
      <div class='color-item' title='${color.name}'>
        <div class='color-view' data-color='${color.color}' style='background-color: ${color.color}'></div>
      </div>`
    }) 
  }

  [CLICK('$projectColors .color-view')] (e) {
    this.updateData({
      color: e.$dt.attr('data-color')
    })
    this.children.$color.setValue(this.state.color);
  }

  [SUBSCRIBE('changeColor')] (color) {
    this.updateData({
      color
    })
  }

  [SUBSCRIBE('changeEndColor')] (color) {
    this.updateEndData({
      color
    })
  }  

  [SUBSCRIBE("showColorPickerPopup")](data, params) {
    data.changeEvent = data.changeEvent || 'changeFillPopup'

    if (!(data.target instanceof UIElement)) {
      throw new Error('ColorPicker needs data.target');
    }

    this.params = params;
    this.setState(data, false);
    this.children.$color.setValue(this.state.color);

    this.show(232);
  }

  [SUBSCRIBE("hideColorPickerPopup")]() {
    this.hide();
  }


}

registElement({ ColorPickerPopup })