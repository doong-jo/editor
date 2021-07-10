import { Editor } from "el/editor/manager/Editor";
import FilterProperty from "./FilterProperty";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.style', {
        FilterProperty
    })
}