
import { CLICK } from "el/base/Event";
import icon from "el/editor/icon/icon";
import { EditorElement } from "../common/EditorElement";


const DEFAULT_TITLE = '';
const DEFAULT_ICON = '';
const DEFAULT_CHECKED = false;

export default class MenuItem extends EditorElement {
    template() {
        return /*html*/`
        <button 
            type="button" 
            class='elf--menu-item ${this.getClassName()}' 
            data-no-title="${this.isHideTitle()}" 
            ${this.isHideTitle() ? `data-tooltip="${this.getTitle()}"` : ''} 
            checked="${this.getChecked() ? 'checked' : ''}"
            ${this.isDisabled() ? 'disabled' : ''}
            data-direction="${this.getDirection()}"
        >
            <div class="icon ${this.getIcon()}">${icon[this.getIconString()] || this.getIconString() || ''}</div>
            <div class="title">${this.getTitle()}</div>
        </button>
        `
    }

    getClassName() {
        return ""
    }

    clickButton(e) { }

    getChecked() {
        return DEFAULT_CHECKED;
    }

    isDisabled() {
        return false;
    }

    setSelected(isSelected) {
        this.$el.toggleClass('selected', isSelected)
    }

    getTitle() {
        return DEFAULT_TITLE;
    }

    getIcon() {
        return DEFAULT_ICON;
    }

    getIconString() {
        return DEFAULT_ICON;
    }

    isHideTitle() {
        return false;
    }

    [CLICK()](e) {
        this.clickButton(e);
    }

    getDirection() {
        return this.props.direction || "";
    }

    static createMenuItem(opt = {}) {
        return class extends MenuItem {
            getIconString() {
                return opt.iconString || 'add_box';
            }

            getTitle() {
                return opt.title || "New Item";
            }

            isHideTitle() {
                return opt.isHideTitle || true;
            }

            clickButton(e) {
                opt.clickButton(e);
            }

            getDirection() {
                return opt.direction;
            }
        }
    }
}