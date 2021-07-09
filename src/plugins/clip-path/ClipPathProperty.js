import { CLICK, LOAD, PREVENT, SUBSCRIBE } from "el/base/Event";
import icon from "el/editor/icon/icon";
import { ClipPath } from "el/editor/property-parser/ClipPath";
import BaseProperty from "el/editor/ui/property/BaseProperty";


var clipPathList = [
  'circle',
  'ellipse',
  'inset',
  'polygon',
  'path',
  'svg'
];

export default class ClipPathProperty extends BaseProperty {
  getTitle() {
    return this.$i18n('clippath.property.title');
  }

  hasKeyframe () {
    return true; 
  }

  getKeyframeProperty () {
    return 'clip-path';
  }


  getClassName() {
    return 'clip-path-property'
  }

  getBody() {
    return /*html*/`<div class='clip-path-list' ref='$clippathList'></div>`;
  }

  getTools() {
    return /*html*/`
      <select ref="$clipPathSelect">      
        ${clipPathList.map(it => {
          return `<option value='${it}'>${it}</option>`
        }).join('')}
      </select>
      <button type="button" ref="$add" title="add Clip Path">${icon.add}</button>
    `;
  }

  makeClipPathTemplate (clippath) {
    return /*html*/`
      <div class='clippath-item'>
        <div class='title'>
          <div class='name'>${clippath}</div>
        </div>
        <div class='tools'>
          <button type="button" class="del">${icon.remove2}</button>
        </div>        
      </div>
    `
  }

  [CLICK('$clippathList .clippath-item .title')] (e) {
    var current = this.$selection.current;
    if (!current) return;


    this.viewClipPathPicker();

  }

  [CLICK('$clippathList .del') + PREVENT] (e) {
    var current = this.$selection.current;
    if (!current) return;

    this.command('setAttribute', 'delete clip-path', { 'clip-path': '' }, current.id);    
    this.emit('hideClipPathPopup');    

    setTimeout(() => {
      this.refresh();
    }, 100)
  }

  [SUBSCRIBE('refreshSelection')] () {
    this.refreshShowIsNot(['project']);
  }


  [LOAD("$clippathList")]() {
    var current = this.$selection.current;
    if (!current) return '';
    if (!current['clip-path']) return ''

    return this.makeClipPathTemplate(current['clip-path'].split('(')[0]);
  }

  [CLICK("$add")]() {

    var current = this.$selection.current;

    if (!current) return ;
    if (current['clip-path']) {
      alert('clip-path is already exists.');
      return; 
    }

    if (current) {
      current['clip-path'] = this.refs.$clipPathSelect.value;

      
      this.command("setAttribute", 'change clip-path', {
        'clip-path':  this.refs.$clipPathSelect.value
      }, current.id);
    }

    this.refresh();
  }

  viewClipPathPicker() {
    var current = this.$selection.current;
    if (!current) return;

    var obj = ClipPath.parseStyle(current['clip-path'])

    switch(obj.type) {
    case 'path':
      var d = current.accumulatedPath(obj.value.trim()).d
      var mode = d ? 'modify' : 'path'

      this.emit('showPathEditor', mode, {
        changeEvent: 'updateClipPathString',
        current,
        d,
        // box: 'box',
        screenX: current.screenX,
        screenY: current.screenY,
        screenWidth: current.screenWidth,
        screenHeight: current.screenHeight,
      }) 
      break; 
    case 'svg':
      // TODO: clip art 선택하기 
      break; 
    default: 
      this.emit("showClipPathPopup", {
        'clip-path': current['clip-path']
      });      
      break; 
    }


  }

  [SUBSCRIBE('updateClipPathString')] (data) {
    var current = this.$selection.current;

    if (!current) return;

    data.d = current.invertPath(data.d).round(1000).d;

    current.reset({
      'clip-path': `path(${data.d})`      
    })

    this.refresh();

    this.emit('updateClipPath', data);
  }

  [SUBSCRIBE('changeClipPathPopup')] (data) {
    var current = this.$selection.current;

    if (!current) return;

    current.reset(data); 

    this.refresh();
    this.command('setAttribute', 'change clip-path', data, current.id);        
  }

}