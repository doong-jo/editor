import { registElement } from "el/base/registElement";
import MenuItem from "./MenuItem";
   
export default class MiddleAlign extends MenuItem {
  getIconString() {
    return 'align_vertical_center';
  }
  getTitle() {
    return "middle";
  }

  isHideTitle () {
    return true; 
  }

  clickButton(e) {
    this.emit('sort.middle');
  }
}

registElement({ MiddleAlign })