import { PropertyItem } from "el/editor/items/PropertyItem";

export class ImageResource extends PropertyItem {
  getDefaultObject(obj = {}) {
    return {
      itemType: "image-resource",
      type: "image",
      ...obj
    };
  }

  isGradient() {
    return false;
  }
  isLinear() {
    return false;
  }
  isRadial() {
    return false;
  }
  isConic() {
    return false;
  }
  isStatic() {
    return false;
  }
  isImage() {
    return false;
  }
  hasAngle() {
    return false;
  }
  isUrl() {
    return false;
  }
  isFile() {
    return false;
  }
  isAttribute() {
    return true;
  }

  toString() {
    return "none";
  }
}
