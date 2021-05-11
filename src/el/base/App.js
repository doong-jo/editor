import Dom from "./Dom";
import { POINTERMOVE, POINTEREND, DEBOUNCE, RESIZE, SUBSCRIBE } from "./Event";
import {
  ADD_BODY_MOUSEMOVE,
  ADD_BODY_MOUSEUP
} from "../editor/types/event";
import { debounce } from "./functions/func";
import { getDist } from "./functions/math";

const EMPTY_POS = { x: 0, y: 0 };
const DEFAULT_POS = { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER };
const MOVE_CHECK_MS = 0;

export const start = (UIElement, opt) => {
  class App extends UIElement {

    initialize() {
      this.$container = Dom.create(this.getContainer());
      this.$container.addClass(this.getClassName());

      this.render(this.$container);

      this.initBodyMoves();
    }
    
    initBodyMoves() {
      this.moves = new Set();
      this.ends = new Set();

      this.modifyBodyMoveSecond(MOVE_CHECK_MS);
    }

    modifyBodyMoveSecond(ms = MOVE_CHECK_MS) {
      this.$config.set("body.move.ms", ms);

      const callback = ms === 0 
                        ? this.loopBodyMoves.bind(this) 
                        : debounce(this.loopBodyMoves.bind(this), this.$config.get("body.move.ms"));


      this.funcBodyMoves = callback;
    }

    loopBodyMoves() {
      var pos = this.$config.get("pos");
      var e = this.$config.get('bodyEvent');
      var lastPos = this.$config.get("lastPos") || DEFAULT_POS;
      var isNotEqualLastPos = !(lastPos.x === pos.x && lastPos.y === pos.y);

      if (isNotEqualLastPos && this.moves.size) {      
        this.moves.forEach(v => {

          const dist = getDist(pos.x, pos.y, v.xy.x, v.xy.y);

          if (Math.abs(dist) > 0.5) {

            var dx = Math.floor(pos.x - v.xy.x);
            var dy = Math.floor(pos.y - v.xy.y);
  
            v.func.call(v.context, dx, dy, 'move', e.pressure);

          }

        });

        this.$config.set('lastPos', pos);
      }
      requestAnimationFrame(this.funcBodyMoves);
    }

    removeBodyMoves() {
      var pos = this.$config.get("pos");
      var e = this.$config.get("bodyEvent");
      if (pos) {
        this.ends.forEach(v => {
          v.func.call(v.context, pos.x - v.xy.x, pos.y - v.xy.y, 'end', e.pressure);
        });  
      }

      this.moves.clear();
      this.ends.clear();
    }

    [SUBSCRIBE(ADD_BODY_MOUSEMOVE)](func, context, xy) {
      this.moves.add({ func, context, xy });
    }

    [SUBSCRIBE(ADD_BODY_MOUSEUP)](func, context, xy) {
      this.ends.add({ func, context, xy });
    }

    getClassName() {
      return opt.className || "csseditor";
    }

    getContainer() {
      return opt.container || document.body;
    }

    template() {
      return opt.template || '<div></div>';
    }

    components() {
      return opt.components || {};
    }

    get plugins() {
      return opt.plugins || [];
    }

    get data() {
      return opt.data || {};
    }    

    [POINTERMOVE("document")](e) {
      var newPos = e.xy || EMPTY_POS;

      this.$config.set("bodyEvent", e);
      this.$config.set("pos", newPos);

      if (!this.requestId) {
        this.requestId = requestAnimationFrame(this.funcBodyMoves);
      }
    }

    [POINTEREND("document")](e) {

      // var newPos = e.xy || EMPTY_POS;
      this.$config.set("bodyEvent", e);
      this.removeBodyMoves();
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }

    [RESIZE('window') + DEBOUNCE(100)] () {
      this.emit('resize.window');
    }
  }

  return new App(opt);
};

export const render = (UIElement, opt) => {
  class App extends UIElement {

    initialize() {
      this.initBodyMoves();
    }
    
    initBodyMoves() {
      this.moves = new Set();
      this.ends = new Set();

      this.modifyBodyMoveSecond(MOVE_CHECK_MS);
    }

    modifyBodyMoveSecond(ms = MOVE_CHECK_MS) {
      this.$config.set("body.move.ms", ms);

      const callback = ms === 0 
                        ? this.loopBodyMoves.bind(this) 
                        : debounce(this.loopBodyMoves.bind(this), this.$config.get("body.move.ms"));


      this.funcBodyMoves = callback;
    }

    loopBodyMoves() {
      var pos = this.$config.get("pos");
      var e = this.$config.get('bodyEvent');
      var lastPos = this.$config.get("lastPos") || DEFAULT_POS;
      var isNotEqualLastPos = !(lastPos.x === pos.x && lastPos.y === pos.y);

      if (isNotEqualLastPos && this.moves.size) {      
        this.moves.forEach(v => {

          const dist = getDist(pos.x, pos.y, v.xy.x, v.xy.y);

          if (Math.abs(dist) > 0.5) {

            var dx = Math.floor(pos.x - v.xy.x);
            var dy = Math.floor(pos.y - v.xy.y);
  
            v.func.call(v.context, dx, dy, 'move', e.pressure);

          }

        });

        this.$config.set('lastPos', pos);
      }
      requestAnimationFrame(this.funcBodyMoves);
    }

    removeBodyMoves() {
      var pos = this.$config.get("pos");
      var e = this.$config.get("bodyEvent");
      if (pos) {
        this.ends.forEach(v => {
          v.func.call(v.context, pos.x - v.xy.x, pos.y - v.xy.y, 'end', e.pressure);
        });  
      }

      this.moves.clear();
      this.ends.clear();
    }

    [SUBSCRIBE(ADD_BODY_MOUSEMOVE)](func, context, xy) {
      this.moves.add({ func, context, xy });
    }

    [SUBSCRIBE(ADD_BODY_MOUSEUP)](func, context, xy) {
      this.ends.add({ func, context, xy });
    }

    getClassName() {
      return opt.className || "csseditor";
    }

    getContainer() {
      return opt.container || document.body;
    }

    template() {
      return opt.template || '<div></div>';
    }

    components() {
      return opt.components || {};
    }

    [POINTERMOVE("document")](e) {
      var newPos = e.xy || EMPTY_POS;

      this.$config.set("bodyEvent", e);
      this.$config.set("pos", newPos);

      if (!this.requestId) {
        this.requestId = requestAnimationFrame(this.funcBodyMoves);
      }
    }

    [POINTEREND("document")](e) {

      // var newPos = e.xy || EMPTY_POS;
      this.$config.set("bodyEvent", e);
      this.removeBodyMoves();
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }

    [RESIZE('window') + DEBOUNCE(100)] () {
      this.emit('resize.window');
    }
  }

  const renderedInstance = new App(opt);

  renderedInstance.render(opt.container || Dom.body());

  return renderedInstance; 
};
