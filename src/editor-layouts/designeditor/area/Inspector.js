
import icon from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { Tabs } from "el/editor/ui/view/Tabs";
import { variable } from 'el/sapa/functions/registElement';

export default class Inspector extends EditorElement {

  components() {
    return {
      Tabs
    }
  }

  template() {
    return /*html*/`
      <div class="feature-control inspector">
        <div>
          <object refClass="Tabs" 
            ref="$tab" 
            ${variable({
              selectedValue: 'style',
              onchange: this.subscribe((value) => {
                this.$config.set("inspector.selectedValue", value);
              })
            })}
          >
            <object refClass="TabPanel" value="style" title="${this.$i18n('inspector.tab.title.style')}" icon=${variable(icon.palette)}>
              <object refClass="AlignmentProperty" />

              <!-- Default Property --> 
              <object refClass="PositionProperty" />
              <object refClass="AppearanceProperty" />                                   

              ${this.$menuManager.generate('inspector.tab.style')}                             
              <div class='empty'></div>
            </object>

            <object refClass="TabPanel" value="transition" title="${this.$i18n('inspector.tab.title.transition')}" icon=${variable(icon.flash_on)}>
              ${this.$menuManager.generate('inspector.tab.transition')}              
              <div class='empty'></div>                
            </object>            

            <object refClass="TabPanel" value="code" title="${this.$i18n('inspector.tab.title.code')}" icon=${variable(icon.code)}>
              ${this.$menuManager.generate('inspector.tab.code')}              
              <div class='empty'></div>                
            </object>    
            
            ${this.$menuManager.getTargetMenuItems('inspector.tab').map(it => {
              const { value, title, loadElements } = it.class;

              return /*html*/`
                <object refClass="TabPanel" value="${value}" title="${title}" icon=${variable(it.icon)}>
                  ${loadElements.map(element => {
                    return /*html*/`<object refClass="${element}" />`
                  })}
                  ${this.$menuManager.generate('inspector.tab.' + it.value)}              
                  <div class='empty'></div>                
                </object> 
              `   
            })}
          </object>
          </div>
        </div>
      </div>
    `;
  }
}