import { convertMatches, reverseMatches } from "el/utils/parser";
import { ColorStep } from "./ColorStep";
import { SVGGradient } from "./SVGGradient";
import { OBJECT_TO_PROPERTY } from "el/utils/func";

export class SVGRadialGradient extends SVGGradient {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      type: "radial-gradient",
      cx: '50%',
      cy: '50%',
      r: '50%',
      fx: '50%',
      fy: '50%',
      fr: '0%',
      spreadMethod: 'pad',
      ...obj
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs('cx', 'cy', 'r', 'fx', 'fy', 'fr','spreadMethod')
      
    }
  }


  toString() {

    if(this.colorsteps.length === 0) return '';    

    var colorString = this.getColorString();

    var {cx, cy, r, fx, fy, fr,spreadMethod} = this.json;
    var opt = [cx, cy, r, fx, fy, fr,spreadMethod].join(' ');

    var result = `${this.json.type}(${opt}, ${colorString})`;

    return result;
  }

  toSVGString(id) {
      var {cx, cy, r, fx, fy, fr,spreadMethod} = this.json;    
      return /*html*/`
<radialGradient ${OBJECT_TO_PROPERTY({ id, cx, cy, r, fx, fy, fr,spreadMethod })} >
  ${this.colorsteps.map(it => {
    return /*html*/`<stop offset="${it.percent}%"  stop-color="${it.color}" />`
  }).join('\n')}
</radialGradient>
`
  }

  toFillValue (id) {
      return `url(#${id})`;
  }  



  static parse(str) {
    var results = convertMatches(str);
    var opt = {} 
    var colorsteps = [];
    results.str
      .split("(")[1]
      .split(")")[0]
      .split(",")
      .map(it => it.trim())
      .forEach((newValue, index) => {
        if (newValue.includes("@")) {
          // color 복원
          newValue = reverseMatches(newValue, results.matches);

          colorsteps.push.apply(colorsteps, ColorStep.parse(newValue));
        } else {

          var [cx, cy, r, fx, fy, fr,spreadMethod] = newValue.split(' ');        

          opt.cx = cx;
          opt.cy = cy;
          opt.r = r;
          opt.fx = fx;
          opt.fy = fy;
          opt.fr = fr;
          opt.spreadMethod = spreadMethod || 'pad'
        }
      });

    return new SVGRadialGradient({ ...opt, colorsteps });
  }
}
