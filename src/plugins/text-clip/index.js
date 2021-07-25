import { Editor } from "el/editor/manager/Editor";
import TextClipProperty from "./TextClipProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.style', {
        TextClipProperty
    })
}