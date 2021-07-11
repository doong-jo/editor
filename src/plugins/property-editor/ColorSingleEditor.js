import { CLICK, BIND, SUBSCRIBE } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";


export default class ColorSingleEditor extends EditorElement {

    initState() { 
        return {
            params: this.props.params,
            color: this.props.color || 'rgba(0, 0, 0, 1)'
        }
    }

    updateData(opt = {}) {
        this.setState(opt, false);
        this.modifyColor();
    }

    modifyColor() {
        this.parent.trigger(this.props.onchange, this.props.key, this.state.color, this.state.params);
    }

    changeColor (color) {
        this.setState({ color })
    }

    setValue (color) {
        this.changeColor(color);
    }

    [BIND('$miniView')] () {
        return {
            style: {
                'background-color': this.state.color
            }
        }
    }

    template() {

        return /*html*/`
            <div class='color-single-editor'>
                <div class='preview' ref='$preview'>
                    <div class='mini-view'>
                        <div class='color-view' style="background-color: ${this.state.color}" ref='$miniView'></div>
                    </div>
                </div>
            </div>
        `
    }


    [CLICK("$preview")](e) {
        this.viewColorPicker();
    }

    viewColorPicker() {
        this.emit("showColorPickerPopup", {
            target: this,
            changeEvent: 'changeColorSingleEditor',
            color: this.state.color
        });
    }


    [SUBSCRIBE("changeColorSingleEditor")](color, data) {
        this.refs.$miniView.cssText(`background-color: ${color}`);
        this.updateData({ color })
    }    
}