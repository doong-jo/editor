
import { ColorStep } from "el/editor/property-parser/image-resource/ColorStep";
import { randomItem, repeat } from "el/utils/func";

export default { 
    title: 'Random Radial', 
    key: 'random-radial', 
    execute: function (count = 42) {
        return repeat(count).map(it => {
            return { 
                gradient: `radial-gradient(circle, ${ColorStep.createColorStep(10)})`
            }
        });
    }
}