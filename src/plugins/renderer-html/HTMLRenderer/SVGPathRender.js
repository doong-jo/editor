import Dom from "el/base/Dom";
import { OBJECT_TO_CLASS } from "el/base/functions/func";
import { Item } from "el/editor/items/Item";
import SVGItemRender from "./SVGItemRender";

export default class SVGPathRender extends SVGItemRender {
    
  /**
   * @param {Item} item
   * @param {Dom} currentElement 
   */
  update (item, currentElement) {

    if (!currentElement) return; 

    var $path = currentElement.$('path');

    if ($path) {
      $path.setAttrNS({
        'd':  item.d,
        'fill-rule': item['fill-rule'] || 'nonezero',
        'filter': this.toFilterValue(item),
        'fill': this.toFillValue(item),
        'stroke': this.toStrokeValue(item)
      })  
    }

    this.updateDefString(item, currentElement)

  }    


  render (item) {
    return /*html*/`
        <svg 
          class='element-item path'  
          xmlns="http://www.w3.org/2000/svg"
          data-id="${item.id}"
        >
            ${this.toDefString(item)}
            <path 
              class="svg-path-item"
              d="${item.d}"
              fill-rule="${item['fill-rule']}"
              filter="${this.toFilterValue(item)}"
              fill="${this.toFillValue(item)}"
              stroke="${this.toStrokeValue(item)}"
            />
        </svg>
    `
  }

}