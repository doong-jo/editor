import UIElement, { EVENT } from "el/base/UIElement";
import { CLICK, BIND, SUBSCRIBE } from "el/base/Event";
import { registElement } from "el/base/registElement";
import { EditorElement } from "../common/EditorElement";

export default class GradientSingleEditor extends EditorElement {

    initState() { 
        return {
            index: this.props.index,
            image: this.props.image,
            color: 'rgba(0, 0, 0, 1)'
        }
    }

    updateData(opt = {}) {
        this.setState(opt, false);
        this.modifyValue(opt);
    }

    modifyValue(value) {
        this.parent.trigger(this.props.onchange, this.props.key, value, this.state.index);
    }

    setValue (obj) {
        this.setState({
            ...obj 
        })
    }

    [BIND('$miniView')] () {
        return {
            style: {
                'background-image': this.state.image, 
                'background-size': 'cover',
                'color': this.props.color,
            }
        }
    }

    template() {

        return /*html*/`
            <div class='gradient-single-editor'>
                <div class='preview' ref='$preview'>
                    <div class='mini-view'>
                        <div class='color-view' style="background-color: ${this.state.color}" ref='$miniView'></div>
                    </div>
                </div>
            </div>
        `
    }


    [CLICK("$preview")](e) {
        this.viewGradientPopup();
    }

    viewGradientPopup() {

        this.emit("showGradientPickerPopup", {
            instance: this,
            changeEvent: 'changeGradientSingle',
            gradient: this.state.image 
        });
    }

    [SUBSCRIBE('changeGradientSingle')] (image, params) {
        this.updateData({ image })

        this.refresh();
      }
}

registElement({ GradientSingleEditor })