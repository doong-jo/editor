import { Editor } from "el/editor/manager/Editor";
import TextProperty from "./TextProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.style', {
        TextProperty
    })
}