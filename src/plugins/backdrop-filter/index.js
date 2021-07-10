import { Editor } from "el/editor/manager/Editor";
import BackdropFilterProperty from "./BackdropFilterProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.style', {
        BackdropFilterProperty
    })
}