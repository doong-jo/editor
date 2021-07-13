import { Layer } from "el/editor/items/Layer";


export class SVGItem extends Layer {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg',
      name: "New SVG",
      elementType: 'svg',
      overflow: 'visible',         
      stroke: 'black',
      'stroke-width': 1,
      'svgfilter': '',
      fill: 'transparent',
      'fill-rule': '',
      'fill-opacity': '',
      'stroke-linecap': '',
      'stroke-linejoin': '',      
      'stroke-dashoffset': 0, 
      'stroke-dasharray': ' ',
      'text-anchor': 'start',
      ...obj
    });
  }


  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs(
        'overflow',
        'stroke',
        'stroke-width',
        'svgfilter',
        'fill',
        'fill-rule',
        'fill-opacity',
        'stroke-linecap',
        'stroke-linejoin',
        'stroke-dashoffset',
        'stroke-dasharray',
        'text-anchor',
      )

    }
  }

  getDefaultTitle() {
    return "SVG";
  }

  isSVG() {
    return true; 
  }
}
