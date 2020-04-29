import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddSVGCircle extends MenuItem {
  getIconString() {
    return icon.outline_circle;
  }
  getTitle() {
    return this.props.title || "SVG Circle";
  }
 
  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('addComponentType', 'svg-circle');
  }

}
