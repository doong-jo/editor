if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let c=Promise.resolve();return r[e]||(c=new Promise(async c=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=c}else importScripts(e),c()})),c.then(()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]})},c=(c,r)=>{Promise.all(c.map(e)).then(e=>r(1===e.length?e[0]:e))},r={require:Promise.resolve(c)};self.define=(c,a,s)=>{r[c]||(r[c]=Promise.resolve().then(()=>{let r={};const d={uri:location.origin+c.slice(1)};return Promise.all(a.map(c=>{switch(c){case"exports":return r;case"module":return d;default:return e(c)}})).then(e=>{const c=s(...e);return r.default||(r.default=c),r})}))}}define("./service-worker.js",["./workbox-24aa846e"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"./index.html",revision:"2fe05169440c02b10cce54b4da74ff91"},{url:"./player.html",revision:"971726b30848dc0d8493f580f06bfdfd"},{url:"3a8ca398e6a5c3b83f4de7c60843a9a0.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"},{url:"color-assets.js?c9678beafc8c4779bd4e",revision:"ffb790b577fcdea955588e636a65d00e"},{url:"editor.css?da92d544095274287cdf",revision:"a4b84f6cd5a17a06e854a59bea57466d"},{url:"editor.js?72d0a698518b6e365120",revision:"bec148b174cef8e215106e07563eb15d"},{url:"gradient-assets.js?7adef0d88b7293ffbb9b",revision:"e522ff6aecc0a08db660f3b470244f00"},{url:"icon.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"},{url:"player.css?da92d544095274287cdf",revision:"a4b84f6cd5a17a06e854a59bea57466d"},{url:"player.js?30281256c588d0c66ffc",revision:"dea242e603a29dc72509df8b8a0992cc"},{url:"react-component-plugin.js?a21cfa1ad9dc55796384",revision:"564f0dca1f00c462d5811b2caf49a2ac"},{url:"vendors~antdesign-icons.js?3b58a38b969facc680c6",revision:"a50f671564bcedd01b4bea7c70dd50b1"},{url:"vendors~feather-icons.js?f0d6a4daf7594c5b80c3",revision:"3c37cf41adf7c677821074c5b1f2777d"},{url:"vendors~primer-oct-icons.js?24ecc6e43c8e3f387cf3",revision:"e2ecf702e09cf3372471e2a15c6b37c1"},{url:"vendors~react-component-plugin.js?9d720ba42c7c1e39e0f6",revision:"40f4e8e84ffd9819b530b98f42d31359"},{url:"vendors~toast-ui-chart.js?f2a2fa8f4da34aeffcd8",revision:"576521af0f2edc2a3cea62d36ddcd559"}],{})}));
