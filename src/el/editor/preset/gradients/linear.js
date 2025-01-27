import { randomItem, repeat } from "el/utils/func";
import { ColorStep } from "el/editor/property-parser/image-resource/ColorStep";

const angle_list = ['0deg', '45deg', '90deg']

export default { 
    title: 'Linear', 
    key: 'linear', 
    execute: function (count = 42) {
        return repeat(count).map(it => {
            return { 
                gradient: `linear-gradient(${randomItem(...angle_list)}, ${ColorStep.createColorStep(2)})`
            }
        });
    }
}