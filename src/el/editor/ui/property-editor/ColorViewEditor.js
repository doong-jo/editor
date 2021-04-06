import UIElement, { EVENT } from "el/base/UIElement";
import { CLICK, INPUT, BIND, FOCUS, BLUR, SUBSCRIBE } from "el/base/Event";
import { registElement } from "el/base/registerElement";
import { EditorElement } from "../common/EditorElement";

export default class ColorViewEditor extends EditorElement {

    initState() {
        return {
            label: this.props.label,
            value: this.props.value || 'rgba(0, 0, 0, 1)'
        }
    }

    updateData(opt = {}) {
        this.setState(opt);
        this.modifyColor();
    }

    updateEndData(opt = {}) {
        this.setState(opt);
        this.modifyEndColor();
    }    

    getValue () {
        return this.state.value; 
    }

    setValue (value) {
        this.changeColor(value)
    }

    modifyColor() {
        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params);
    }

    modifyEndColor() {
        this.parent.trigger(this.props.onchangeend, this.props.key, this.state.value, this.props.params);
    }


    changeColor (value) {
        this.setState({ value })
    }

    refresh () {
        this.refs.$miniView.cssText(`background-color: ${this.state.value}`);
        this.refs.$colorCode.val(this.state.value);
    }

    template() {
        var { label } = this.state;
        var hasLabel = !!label ? 'has-label' : ''
        return /*html*/`
            <div class='color-view-editor ${hasLabel}'>
                ${label ? `<label>${label}</label>` : '' }            
                <div class='color-code' ref="$container">
                    <div class='preview' ref='$preview'>
                        <div class='mini-view'>
                            <div class='color-view' style="background-color: ${this.state.value}" ref='$miniView'></div>
                        </div>
                    </div>                
                    <input type="text" ref='$colorCode' value='${this.state.value}' tabIndex="1" />
                </div>
            </div>
        ` 
    }

    [BIND('$miniView')] () {
        return {
            style: {
                'background-color': this.state.value
            }
        }
    }

    [BIND('$colorCode')] () {
        return {
            value: this.state.value
        }
    }

    [FOCUS('$colorCode')] (e) {
        this.refs.$container.addClass('focused');
    }

    [BLUR('$colorCode')] (e) {
        this.refs.$container.removeClass('focused');
    }

    [CLICK("$preview")](e) {
        this.viewColorPicker();
    }

    viewColorPicker() {
        this.emit("showColorPickerPopup", {
            target: this, 
            changeEvent: 'changeColorViewEditor',
            changeEndEvent: 'changeEndColorViewEditor',
            color: this.state.value
        });
    }


    [CLICK('$remove')] (e) {
        this.updateData({ value: ''})
    }    

    [INPUT("$el .color-code input")](e) {
        var color = e.$dt.value;
        this.refs.$miniView.cssText(`background-color: ${color}`);

        this.updateData({ value: color })
    }

    [SUBSCRIBE("changeColorViewEditor")](color) {
        this.updateData({ value: color })
    }

    [SUBSCRIBE("changeEndColorViewEditor")](color) {
        this.updateEndData({ value: color })
    }    

}

registElement({ ColorViewEditor })