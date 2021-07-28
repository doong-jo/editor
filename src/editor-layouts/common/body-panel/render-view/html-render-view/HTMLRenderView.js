import { vec3 } from "gl-matrix";

import { BIND, POINTERSTART, MOVE, END, IF, KEYUP, DOUBLECLICK, FOCUSOUT, SUBSCRIBE } from "el/base/Event";
import { Length } from "el/editor/unit/Length";
import Dom from "el/base/Dom";
import { isFunction } from "el/base/functions/func";
import { KEY_CODE } from "el/editor/types/key";

import { EditorElement } from "el/editor/ui/common/EditorElement";
import StyleView from "./StyleView";

import './HTMLRenderView.scss';

export default class HTMLRenderView extends EditorElement {

    components() {
        return {
            StyleView,
        }
    }

    initState() {
        return {
            mode: 'selection',
            x: Length.z(),
            y: Length.z(),
            width: Length.px(10000),
            height: Length.px(10000),
            cachedCurrentElement: {},
            html: '',
        }
    }

    template() {
        return /*html*/`
            <div class='elf--element-view' ref='$body'>
                <object refClass='StyleView' ref='$styleView' />
                <div class='canvas-view' ref='$view'></div>
                ${this.$menuManager.generate("render.view")}
            </div>
        `
    }

    [SUBSCRIBE('afterChangeMode')]() {
        this.$el.attr('data-mode', this.$editor.mode);
    }

    [SUBSCRIBE('refElement')](id, callback) {
        isFunction(callback) && callback(this.getElement(id))
    }

    clearElementAll() {
        this.$selection.each(item => {
            this.clearElement(item.id);
        });
    }

    clearElement(id) {
        this.state.cachedCurrentElement[id] = undefined
    }

    getElement(id) {

        if (!this.state.cachedCurrentElement[id]) {
            this.state.cachedCurrentElement[id] = this.refs.$view.$(`[data-id="${id}"]`);
        }

        return this.state.cachedCurrentElement[id];
    }

    // text 의 경우 doubleclick 을 해야 포커스를 줄 수 있고 
    // 그 이후에 편집이 가능하다. 
    [DOUBLECLICK('$view .element-item.text .text-content')](e) {
        e.$dt.addClass('focused');
        e.$dt.attr('contenteditable', 'true');
        e.$dt.focus();
        e.$dt.select();
    }

    [FOCUSOUT('$view .element-item.text .text-content')](e) {
        e.$dt.removeAttr('contenteditable');
        e.$dt.removeClass('focused');
    }

    [KEYUP('$view .element-item.text .text-content')](e) {

        var content = e.$dt.html()
        var text = e.$dt.text();
        var id = e.$dt.parent().attr('data-id');
        //FIXME: matrix에 기반한 좌표 연산이 필요하다. 

        var arr = []
        this.$selection.items.filter(it => it.id === id).forEach(it => {
            it.reset({
                content,
                text,
            })
            arr.push({ id: it.id, content, text })
        })

        this.emit('refreshContent', arr);

        this.emit('refreshSelectionTool', false);
    }

    /**
     * 레이어를 움직이기 위한 이벤트 실행 여부 체크 
     * 
     * @param {PointerEvent} e 
     */
    checkEditMode(e) {
        // hand tool 이 on 되어 있으면 드래그 하지 않는다. 
        if (this.$config.get('set.tool.hand')) {
            return false;
        }

        // space 키가 눌러져있을 때는 실행하지 않는다. 
        const code = this.$shortcuts.getGeneratedKeyCode(KEY_CODE.space);
        if (this.$keyboardManager.check(code)) {
            return false;
        }


        const mousePoint = this.$viewport.getWorldPosition(e);
        if (this.$selection.hasPoint(mousePoint)) {
            return true;
        }

        const $target = Dom.create(e.target);
        if ($target.hasClass('canvas-view')) {
            return false;
        }

        const $element = $target.closest('element-item');

        if ($element) {
            // text 에 focus 가 가있는 경우는 움직이지 않는다. 
            if ($element.hasClass('focused')) {
                return false;
            }

            var id = $element.attr('data-id')

            // altKey 눌러서 copy 하지 않고 드랙그만 하게 되면  
            if (e.altKey === false) {
                const item = this.$selection.currentProject.searchById(id);

                // artboard 가 자식이 있으면 움직이지 않음 
                if (item.is('artboard') && item.hasChildren()) {
                    this.$config.set('set.dragarea.mode', true);
                    return true;
                }

            }

        } else {

            if (this.$editor.isSelectionMode()) {
                return true;
            }

            // 움직일 수 있는 영역이 아니기 때문에 false 리턴해서 드래그를 막는다. 
            return false;
        }


        return this.$editor.isSelectionMode()
    }

    [DOUBLECLICK('$view')](e) {
        const $item = Dom.create(e.target).closest('element-item');
        const id = $item.attr('data-id');

        const item = this.$selection.get(id);

        if (this.$selection.isOne && item) {
            this.emit('openEditor');
            // this.emit('hideSelectionToolView');
            this.emit('removeGuideLine');
        }   
    }

    /**
     * 드래그 해서 객체 옮기기 
     *
     * ctrl + pointerstart 하는  시점에 카피해보자.  
     * 
     * @param {PointerEvent} e 
     */
    [POINTERSTART('$view') + IF('checkEditMode')
        + MOVE('calculateMovedElement')
        + END('calculateEndedElement')
    ](e) {
        this.initMousePoint = this.$viewport.getWorldPosition(e);

        if (this.$config.get('set.dragarea.mode')) {
            this.emit('startDragAreaView');    

            return;
        }


        let isInSelectedArea = this.$selection.hasPoint(this.initMousePoint)
        const $target = Dom.create(e.target);

        if ($target.hasClass('canvas-view')) {
            this.$selection.select();
            this.initializeDragSelection();
            this.emit('history.refreshSelection');

            return false;
        }

        const $element = $target.closest('element-item');

        var id = $element && $element.attr('data-id');

        // 선택한 영역이 있지만 artboard 가 아닌 경우 객체 선택으로 한다. 
        if (isInSelectedArea && $element && $element.hasClass('artboard') === false) {
            isInSelectedArea = false;
        }

        // alt(option) + pointerstart 시점에 Layer 카피하기         
        if (e.altKey) {

            if (isInSelectedArea) {
                // 이미 selection 영역안에 있으면 그대로 드래그 할 수 있도록 맞춘다. 
            } else {
                if (this.$selection.check({ id }) === false) {
                    // 선택된게 없으면 id 로 선택 
                    this.$selection.selectById(id);
                }
            }

            if (this.$selection.isEmpty === false) {
                // 선택된 모든 객체 카피하기 
                this.$selection.selectAfterCopy();
                this.trigger('refreshAllCanvas')
                this.emit('refreshLayerTreeView')

                // this.selectCurrent(...this.$selection.items)
                this.initializeDragSelection();
                this.emit('history.refreshSelection');
            }

        } else {

            if (isInSelectedArea) {
                // 이미 selection 영역안에 있으면 그대로 드래그 할 수 있도록 맞춘다. 
            } else {
                // shift key 는 selection 을 토글한다. 
                if (e.shiftKey) {
                    this.$selection.toggleById(id);
                } else {
                    // 선택이 안되어 있으면 선택 
                    if (this.$selection.check({ id }) === false) {

                        const current = this.$selection.currentProject.searchById(id);
                        if (current && current.is('artboard') && current.hasChildren()) {
                            // NOOP
                        } else {
                            this.$selection.selectById(id);
                        }

                    }
                }

            }


            // this.selectCurrent(...this.$selection.items)
            this.initializeDragSelection();
            this.emit('history.refreshSelection');

            // console.log(this.$selection.current);
        }

    }

    initializeDragSelection() {
        this.$selection.reselect();
        this.$snapManager.clear();

        this.emit('refreshSelectionTool', true);
    }

    calculateMovedElement() {

        if (this.$config.get('set.dragarea.mode')) {
            this.emit('moveDragAreaView');            
            return;    
        }

        // layout item 은 움직이지 않고 layout 이 좌표를 그리도록 한다. 
        if (this.$selection.isLayoutItem) {
            return;
        }

        const targetMousePoint = this.$viewport.getWorldPosition();

        const newDist = vec3.floor([], vec3.subtract([], targetMousePoint, this.initMousePoint));

        this.moveTo(newDist);

        // 최종 위치에서 ArtBoard 변경하기 
        if (this.$selection.changeArtBoard()) {
            this.initMousePoint = targetMousePoint;
            this.$selection.reselect();
            this.$snapManager.clear();
            this.clearElementAll();

            this.trigger('refreshAllCanvas')

            // ArtBoard 변경 이후에 LayerTreeView 업데이트
            this.emit('refreshLayerTreeView')
        }

        this.emit('setAttributeForMulti', this.$selection.pack('x', 'y'));
        this.emit('refreshSelectionTool', true);

    }

    moveTo(newDist) {

        newDist = vec3.floor([], newDist);

        //////  snap 체크 하기 
        const snap = this.$snapManager.check(this.$selection.cachedRectVerties.map(v => {
            return vec3.add([], v, newDist)
        }), 3);

        const localDist = vec3.add([], snap, newDist);

        const result = {}
        this.$selection.cachedItemVerties.forEach(it => {
            result[it.id] = {
                x: Length.px(it.x + localDist[0]).round(1000),          // 1px 단위로 위치 설정 
                y: Length.px(it.y + localDist[1]).round(1000),
            }
        })
        this.$selection.reset(result);
    }

    [SUBSCRIBE('selectionToolView.moveTo')](newDist) {
        this.moveTo(newDist);
        this.emit('refreshSelectionTool', true);
    }

    calculateEndedElement(dx, dy) {
        const targetMousePoint = this.$viewport.getWorldPosition();
        const newDist = vec3.dist(targetMousePoint, this.initMousePoint);

        if (this.$config.get('set.dragarea.mode')) {
            this.emit('endDragAreaView');
            this.$config.set('set.dragarea.mode', false)
            return; 
        }

        if (newDist < 1) {
            if (this.$selection.current) {
                // this.emit('openEditor');
                // this.emit('hideSelectionToolView');
                // this.emit('removeGuideLine');
                // return;
            }
        } else {
            this.$selection.reselect();
            this.$snapManager.clear();
            // this.emit('removeGuideLine');
            this.command(
                'setAttributeForMulti',
                "move item",
                this.$selection.pack('x', 'y')
            );
        }

        this.emit('refreshSelectionTool', true);
    }

    [BIND('$body')]() {
        const { canvasWidth, canvasHeight, mode } = this.$editor;

        var width = Length.px(canvasWidth);
        var height = Length.px(canvasHeight);

        return {
            'data-mode': mode,
            'tabIndex': -1,
            style: {
                width,
                height,
            }
        }
    }

    [BIND('$view')]() {

        const { translate, transformOrigin: origin, scale } = this.$viewport;

        const transform = `translate(${translate[0]}px, ${translate[1]}px) scale(${scale || 1})`;
        const transformOrigin = `${origin[0]}px ${origin[1]}px`

        return {
            style: {
                'transform-origin': transformOrigin,
                transform
            }
        }
    }



    // 객체를 부분 업데이트 하기 위한 메소드 
    [SUBSCRIBE('refreshSelectionStyleView')](obj) {
        var items = obj ? [obj] : this.$selection.items;

        items.forEach(current => {
            this.updateElement(current);
        })

        // this.selectCurrent(...items);
    }

    updateElement(item) {
        if (item) {
            this.$editor.html.update(item, this.getElement(item.id), this.$editor)
        }

    }

    // 타임라인에서 객체를 업데이트 할 때 발생함. 
    updateTimelineElement(item) {
        if (item) {
            this.$editor.html.update(item, this.getElement(item.id), this.$editor)
        }

    }

    [SUBSCRIBE('playTimeline', 'moveTimeline')]() {

        const project = this.$selection.currentProject;
        var timeline = project.getSelectedTimeline();

        if (timeline) {
            timeline.animations.map(it => project.searchById(it.id)).forEach(current => {
                this.updateTimelineElement(current, true, false);
            })
        }

    }

    /**
     * canvas 전체 다시 그리기 
     */
    [SUBSCRIBE('refreshAllCanvas')]() {

        this.clearElementAll();

        const project = this.$selection.currentProject

        const html = this.$editor.html.render(project, null, this.$editor) || '';

        this.setState({ html }, false)
        this.refs.$view.updateDiff(html)

        this.bindData('$view');

        // 최초 전체 객체를 돌면서 update 함수를 실행해줄 트리거가 필요하다. 
        this.trigger('updateAllCanvas', project);
    }

    [SUBSCRIBE('updateAllCanvas')](parentLayer) {
        parentLayer.layers.forEach(item => {
            this.updateElement(item, this.getElement(item.id));
            this.trigger('updateAllCanvas', item);
        })
    }

    [SUBSCRIBE('refreshAllElementBoundSize')]() {

        var selectionList = this.$selection.items.map(it => it.is('artboard') ? it : it.parent)

        var list = [...new Set(selectionList)];
        list.forEach(it => {
            this.trigger('refreshElementBoundSize', it);
        })
    }

    [SUBSCRIBE('refreshElementBoundSize')](parentObj) {
        if (parentObj) {
            parentObj.layers.forEach(it => {
                if (it.isLayoutItem()) {
                    var $el = this.getElement(it.id);

                    if ($el) {
                        const { x, y, width, height } = $el.offsetRect();

                        it.reset({
                            x: Length.px(x),
                            y: Length.px(y),
                            width: Length.px(width),
                            height: Length.px(height)
                        })

                        // if (it.is('component')) {
                        //     this.emit('refreshStyleView', it, true);
                        // }

                        // svg 객체  path, polygon 은  크기가 바뀌면 내부 path도 같이 scale up/down  이 되어야 하는데 
                        // 이건 어떻게 적용하나 ....                     
                        this.trigger('refreshSelectionStyleView', it, true);
                    }
                }

                this.trigger('refreshElementBoundSize', it);
            })
        }
    }

    [SUBSCRIBE('updateViewport')]() {
        this.bindData('$view');
    }

}