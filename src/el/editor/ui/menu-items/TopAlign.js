import MenuItem from "./MenuItem";
   
export default class TopAlign extends MenuItem {
  getIconString() {
    return 'align_vertical_top';
  }
  getTitle() {
    return "Top";
  }

  isHideTitle () {
    return true; 
  }  

  clickButton(e) {
    this.emit('sort.top');
  }
}