import { SUBSCRIBE_SELF } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { variable } from "el/sapa/functions/registElement";


export default class LanguageSelector extends EditorElement {

    get locales () {
        return Object.keys(this.$editor.i18n.locales);
    }

    template () {

        var languages = this.locales.map(lang => {
            var label = this.$i18n(`app.lang.${lang}`)
            return {text: label, value: lang}
        });

        return /*html*/`
            <div class='status-selector'>
                <label>${this.$i18n('app.label.lang')}</label>
                <div class='item'>
                    <object refClass="SelectEditor"  
                        ref='$locale' 
                        options=${variable(languages)}
                        value="${this.$editor.locale}" 
                        onchange="changeLocale"
                    /> 
                </div>
            </div>
        `

    }

    [SUBSCRIBE_SELF('changeLocale')] (key, locale) {
        this.emit('setLocale', locale);
    }
}