import "./scss/index.scss";

import Util from "el/base/index";
import EasyLogic from "./editor-layouts/designeditor/index";

const CSS = {
  version: '@@VERSION@@',  
  ...Util,
  ...EasyLogic,  
};

new EasyLogic.createDesignEditor();