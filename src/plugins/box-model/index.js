import { Editor } from "el/editor/manager/Editor";
import BoxModelProperty from "./BoxModelProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.style', {
        BoxModelProperty
    })
}