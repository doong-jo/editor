
import "../menu-items/index";
import { CLICK, SUBSCRIBE } from "el/base/Event";
import { registElement } from "el/base/registElement";
import { EditorElement } from "../common/EditorElement";

export default class SingleToolMenu extends EditorElement {
  template() {
    return /*html*/`
      <div class='tool-menu center'>
        <div class='items'>
          <div class='draw-items' ref='$items' data-selected-value="${this.$editor.layout}">

            <object refClass='SelectTool' />
            <span data-item='css'>
              <object refClass='AddRect' />
              <object refClass='AddCircle' />         
              <object refClass='AddText' />
              <object refClass='AddImage' />
              <object refClass='AddVideo' />
              <object refClass='AddIFrame' />
            </span>            
            <span data-item='svg'>
              <div class='divider'></div>
              <object refClass='AddDrawPath' />
              <object refClass='AddPath' />
              <object refClass='AddSVGRect' />
              <object refClass='AddSVGCircle' />            
              <!-- <AddSVGText /> -->
              <object refClass='AddSVGTextPath' />
              <object refClass='AddPolygon' />
            </span>
          </div>
        </div>

      </div>
    `;
  }

  [SUBSCRIBE('changedEditorlayout')] () {
    this.refs.$items.attr('data-selected-value', this.$editor.layout)
  }

  [SUBSCRIBE('noneSelectMenu')] () {
    var $selected = this.refs.$items.$('.selected');
    if ($selected) {
      $selected.removeClass('selected');
    }
  }

  [CLICK('$items button')] (e) {
    e.$dt.onlyOneClass('selected');
  }
}

registElement({ SingleToolMenu })