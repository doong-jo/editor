
import "../../../../el/editor/ui/menu-items/index";
import { CLICK, SUBSCRIBE } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { css } from "@emotion/css";

export default class ToolMenu extends EditorElement {

  afterRender() {
    setTimeout(() => {
      this.$el.$$(".elf--menu-item").forEach(it => {
        it.attr('data-direction', 'right');
      })
    }, 500);

  }

  template() {
    return /*html*/`
      <div class='tool-menu center'>
        <div class='items'>
          <div class='draw-items' ref='$items' data-selected-value="${this.$editor.layout}">

            <object refClass='SelectTool' />
            <object refClass='AddArtboard' />
            <span data-item='css'>
              <object refClass='AddRect' />
              <object refClass='AddCircle' />         
              <object refClass='AddText' />
              <object refClass='AddImage' />
              <object refClass='AddVideo' />
              ${this.$menuManager.generate('tool.menu.css')}
            </span>            
            <span data-item='svg'>
              <div class='${css(`display: block;height:2px;width:100%;border-bottom:1px solid var(--elf--border-color);`)}' ></div>
              <object refClass='AddDrawPath' />
              <object refClass='AddPath' />
              <object refClass='AddSVGRect' />
              <object refClass='AddSVGCircle' />            
              <!-- <AddSVGText /> -->
              <object refClass='AddSVGTextPath' />
              <object refClass='AddPolygon' />
              ${this.$menuManager.generate('tool.menu.svg')}              
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