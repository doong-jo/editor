if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let c=Promise.resolve();return r[e]||(c=new Promise(async c=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=c}else importScripts(e),c()})),c.then(()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]})},c=(c,r)=>{Promise.all(c.map(e)).then(e=>r(1===e.length?e[0]:e))},r={require:Promise.resolve(c)};self.define=(c,a,i)=>{r[c]||(r[c]=Promise.resolve().then(()=>{let r={};const s={uri:location.origin+c.slice(1)};return Promise.all(a.map(c=>{switch(c){case"exports":return r;case"module":return s;default:return e(c)}})).then(e=>{const c=i(...e);return r.default||(r.default=c),r})}))}}define("./service-worker.js",["./workbox-d9851aed"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/./canvas.html",revision:"768ece8fc7e9623913caed00c8ee480a"},{url:"/./embed.html",revision:"68abef4597310b006f4ac4b0330b7f4f"},{url:"/./index.html",revision:"1ae56be540780ebf774e2ceeea22e37d"},{url:"/./player.html",revision:"504e84be3a659c56f84269f741ebd7b3"},{url:"/3a8ca398e6a5c3b83f4de7c60843a9a0.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"},{url:"/canvas.css?39bda1b0de492d75a64a",revision:"0f617cd479e23ef396578b001824d1a7"},{url:"/canvas.js?63755b0511cd9202527c",revision:"60b2172be5b8c8c84ae95bce9923e2ec"},{url:"/editor.css?050dc5ae01ed63640602",revision:"23f894ae0f1c9f6d8b0fdda7ce3f11c4"},{url:"/editor.js?01430df16c5342205173",revision:"1826e9c5b7f1f19f25b85f60033cf019"},{url:"/embed.css?f466971ec975577c5c84",revision:"e4720dd00ce226878aea9350323c7602"},{url:"/embed.js?657a73d94eaabe5417e4",revision:"5a3d890ae5c281dc72f351ce0ecd1fc7"},{url:"/icon.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"},{url:"/player.css?d94d774e58ae5dae9ac7",revision:"271a3be00707714326e311896c694788"},{url:"/player.js?459cb14cd284f7fe39d5",revision:"3686fcc11e262aa0b8bcbde3326c153f"}],{})}));
