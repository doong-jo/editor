import { Editor } from "el/editor/manager/Editor";
import { ClipPath } from "../property-parser/ClipPath";

export default {
    command: 'openEditor',

    description: 'Open custom editor for item  when doubleclick is fired',

    /**
     * 
     * @param {Editor} editor 
     * @param {object} pathObject 
     * @param {string} pathObject.d    svg path 문자열 
     */
    execute: function (editor) {

        if (editor.selection.isOne === false) return;

        var current = editor.selection.current;

        if (current) {
            current.setCache();

            // d 속성은 자동으로 페스 에디터로 연결 
            if (current.d) {
                // box 모드 
                // box - x, y, width, height 고정된 상태로  path 정보만 변경 
                editor.emit('showPathEditor', 'modify', {
                    box: 'canvas',
                    current,
                    d: current.accumulatedPath().d,
                    changeEvent: (data) => {
                        console.log(data.d);
                        editor.emit('updatePathItem', data);
                    }
                })
                editor.emit('hideSelectionToolView');
            } else if (current['clip-path']) {
                var obj = ClipPath.parseStyle(current['clip-path'])

                if (obj.type === 'path') {
                    var d = current.accumulatedPath(current.clipPathString).d
                    var mode = d ? 'modify' : 'path'

                    editor.emit('showPathEditor', mode, {
                        changeEvent: (data) => {
                            data.d = current.invertPath(data.d).scale(1 / current.width.value, 1 / current.height.value).d;

                            // d 속성 (path 문자열) 을 설정한다. 
                            editor.command('setAttributeForMulti', 'change clip-path', editor.selection.packByValue({
                                'clip-path': `path(${data.d})`,
                            }))
                        },
                        current,
                        d,
                    })
                    editor.emit('hideSelectionToolView');
                } else if (obj.type === 'svg') {
                    // NOOP
                } else {
                    editor.emit("showClipPathPopup", {
                        'clip-path': current['clip-path'],
                        changeEvent: function (data) {
                            editor.command('setAttributeForMulti', 'change clip-path', editor.selection.packByValue(data));
                        }
                    });
                }

            } else {
                // 기타 다른 에디터 연동하기 
            }
        }

    }

}