
import "./ObjectItems";
import { CLICK } from "el/base/Event";
import "./LibraryItems";
import "./ComponentItems";
import icon from "el/editor/icon/icon";
import "../view/PreviewToolMenu";
import "./ShortCutItems";
import "../property";
import "./ArtboardItems";
import { registElement } from "el/base/registElement";
import { EditorElement } from "../common/EditorElement";


export default class LayerTab extends EditorElement {

  initState() {
    return {
      selectedIndex: 2
    }
  }

  template() {
    return /*html*/`
      <div class='layer-tab'>
        <div class="tab number-tab side-tab side-tab-left" data-selected-value="2" ref="$tab">
          <div class="tab-header" ref="$header">   
            <div class="tab-item selected" data-value="2" data-direction="right" data-tooltip="${this.$i18n('app.tab.title.layers')}">
              <label>${icon.layers}</label>
            </div>            
            <div class='tab-item' data-value='3' data-direction="right"  data-tooltip="${this.$i18n('app.tab.title.libraries')}">
              <label>${icon.auto_awesome}</label>
            </div>                     
            <div class='tab-item' data-value='5' data-direction="right"  data-tooltip="${this.$i18n('app.tab.title.assets')}">
              <label>${icon.apps}</label>
            </div>   
            <div class='tab-item' data-value='6' data-direction="right"  data-tooltip="${this.$i18n('app.tab.title.artboards')}">
              <label>${icon.artboard}</label>
            </div>            
            <div class='tab-item' data-value='4' data-direction="right"  data-tooltip="${this.$i18n('app.tab.title.components')}">
              <label>${icon.plugin}</label>
            </div>
          </div>
          <div class="tab-body" ref="$body">
            <div class="tab-content selected" data-value="2">
              <object refClass="ObjectItems" />
            </div>
            <div class='tab-content' data-value='3'>
              <object refClass="LibraryItems" />
            </div>            
            <div class='tab-content' data-value='4'>
              <object refClass="ComponentItems" />
            </div>    
            <div class='tab-content' data-value='5'>
              <object refClass="AssetItems" />            
              <div class='assets'>
                <object refClass="GradientAssetsProperty" />    
                <object refClass="PatternAssetsProperty" />    
                <object refClass="ImageAssetsProperty" />      
                <object refClass="VideoAssetsProperty" />       
                <object refClass="SVGFilterAssetsProperty" />                
              </div>
            </div>
            <div class='tab-content' data-value='6'>
              <object refClass="ArtboardItems" />
            </div>
          </div>
        </div>
      </div>
    `;
  }

  [CLICK("$header .tab-item:not(.extra-item)")](e) {

    var selectedIndex = +e.$dt.attr('data-value')
    if (this.state.selectedIndex === selectedIndex) {
      return; 
    }

    this.$el.$$(`[data-value="${this.state.selectedIndex}"]`).forEach(it => it.removeClass('selected'))
    this.$el.$$(`[data-value="${selectedIndex}"]`).forEach(it => it.addClass('selected'))
    this.setState({ selectedIndex }, false);
  }
}

registElement({ LayerTab })