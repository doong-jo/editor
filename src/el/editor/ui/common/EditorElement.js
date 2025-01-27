
import UIElement from "el/sapa/UIElement";
import { ConfigManager } from "el/editor/manager/ConfigManager";
import { MenuItemManager } from "el/editor/manager/MenuItemManager";
import { SelectionManager } from "el/editor/manager/SelectionManager";
import { ViewportManager } from "el/editor/manager/ViewportManager";
import { ADD_BODY_FIRST_MOUSEMOVE, ADD_BODY_MOUSEMOVE, ADD_BODY_MOUSEUP } from "el/editor/types/event";

export class EditorElement extends UIElement {


    initialize() {
        super.initialize();
    
        // EditorElement 내부에서 i18n 을 바로 설정 할 수 있도록 셋팅한다.  
        this.$editor.registerI18nMessageWithLocale(this.initializeI18nMessage());
    }

    /**
     * i18n 메세지 로드 
     * 
     * @example 
     * 
     * ```json
     * {
     *     en_US: {
     *         "toolbar.add.rect.name": "add Rectangle"
     *     }
     * }
     * 
     * ```
     * ```js
     * console.log(this.i18n("toolbar.add.rect.name"));
     * ```
     * 
     * @override
     */ 
    initializeI18nMessage() {
        return {}
    }

    /**
     * Editor 루트를 재정의 해서 사용
     * 
     * @override
     */
    get $editor() {
        return this.parent.$editor;
    }

    /**
     * 메세징 루트를 재정의 할 수 있음. 
     * 
     * @override
     */
    get $store() {
        return this.$editor.store || this.parent.$store;
    }

    // editor utility 

    /**
     * i18n 텍스트를 리턴한다. 
     * 
     * @param {string} key 
     * @returns {string} i18n 텍스트 
     */
    $i18n(key, params = {}, locale) {
        return this.$editor.getI18nMessage(key, params, locale);
    }

    $initI18n(key) {
        return this.$editor.initI18nMessage(key);
    }

    /**
     * @type {ConfigManager}
     */ 
    get $config() {
        return this.$editor.config;
    }

    /**
     * @type {SelectionManager}
     */
    get $selection() {
        return this.$editor.selection;
    }

    /**
     * @type {ViewportManager} $viewport
     */
    get $viewport() {
        return this.$editor.viewport;
    }

    /**
     * @type {SnapManager} $snapManager
     */
    get $snapManager() {
        return this.$editor.snapManager;
    }

    get $timeline() {
        return this.$editor.timeline;
    }

    get $history() {
        return this.$editor.history;
    }

    /**
     * @type {ShortCutManager} $shortcuts
     */
    get $shortcuts() {
        return this.$editor.shortcuts;
    }

    /**
     * @type {KeyBoardManager} $keyboardManager
     */
    get $keyboardManager() {
        return this.$editor.keyboardManager;
    }

    /**
     * @type {StorageManager} $storageManager
     */
    get $storageManager() {
        return this.$editor.storageManager;
    }

    /**
     * @type {MenuItemManager}
     */ 
    get $menuManager() {
        return this.$editor.menuItemManager;
    }

    get $model() {
        return this.$editor.modelManager;
    }

    /**
     * history 가 필요한 커맨드는 command 함수를 사용하자. 
     * 마우스 업 상태에 따라서 자동으로 history 커맨드로 분기해준다. 
     * 기존 emit 과 거의 동일하게 사용할 수 있다.   
     * 
     * @param {string} command 
     * @param {string} description 
     * @param {any[]} args 
     */

    command(command, description, ...args) {
        if (this.$editor.isPointerUp) {
            return this.emit(`history.${command}`, description, ...args);
        } else {
            return this.emit(command, ...args);
        }

    }

    $theme(key) {
        return this.$editor.themeValue(key);
    }

    bodyMouseFirstMove(e, methodName) {
        if (this[methodName]) {
            this.emit(ADD_BODY_FIRST_MOUSEMOVE, this[methodName], this, e.xy);
        }
    }


    bodyMouseMove(e, methodName) {
        if (this[methodName]) {
            this.emit(ADD_BODY_MOUSEMOVE, this[methodName], this, e.xy);
        }
    }

    bodyMouseUp(e, methodName) {
        if (this[methodName]) {
            this.emit(ADD_BODY_MOUSEUP, this[methodName], this, e.xy);
        }
    }

}