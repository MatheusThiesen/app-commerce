if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,c)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let o={};const t=e=>a(e,i),r={module:{uri:i},exports:o,require:t};s[i]=Promise.all(n.map((e=>r[e]||t(e)))).then((e=>(c(...e),o)))}}define(["./workbox-588899ac"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/Wfub02cUbdpke6COT5Qrg/_buildManifest.js",revision:"3f78c8aed081a05ee779b399d449566b"},{url:"/_next/static/Wfub02cUbdpke6COT5Qrg/_middlewareManifest.js",revision:"fb2823d66b3e778e04a3f681d0d2fb19"},{url:"/_next/static/Wfub02cUbdpke6COT5Qrg/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/187-d2010e963df691ed.js",revision:"d2010e963df691ed"},{url:"/_next/static/chunks/1bfc9850-27c49a8e74aea6cb.js",revision:"27c49a8e74aea6cb"},{url:"/_next/static/chunks/288-839b67fe029e243e.js",revision:"839b67fe029e243e"},{url:"/_next/static/chunks/435-fa38a4f2d3846ff0.js",revision:"fa38a4f2d3846ff0"},{url:"/_next/static/chunks/612-dfcfb51d5b4028d6.js",revision:"dfcfb51d5b4028d6"},{url:"/_next/static/chunks/733-cd5461c458002338.js",revision:"cd5461c458002338"},{url:"/_next/static/chunks/734-16917260b17a2a30.js",revision:"16917260b17a2a30"},{url:"/_next/static/chunks/907-dc54dc886a653746.js",revision:"dc54dc886a653746"},{url:"/_next/static/chunks/95b64a6e-130358a21ef26940.js",revision:"130358a21ef26940"},{url:"/_next/static/chunks/de71a805-2b9bb3f115f7badb.js",revision:"2b9bb3f115f7badb"},{url:"/_next/static/chunks/framework-fc97f3f1282ce3ed.js",revision:"fc97f3f1282ce3ed"},{url:"/_next/static/chunks/main-f7e9e30f0d23bc87.js",revision:"f7e9e30f0d23bc87"},{url:"/_next/static/chunks/pages/_app-e59129bef79da400.js",revision:"e59129bef79da400"},{url:"/_next/static/chunks/pages/_error-1995526792b513b2.js",revision:"1995526792b513b2"},{url:"/_next/static/chunks/pages/clientes-dba094eb57f4e21c.js",revision:"dba094eb57f4e21c"},{url:"/_next/static/chunks/pages/clientes/%5Bslug%5D-a8d0f7554007b5d7.js",revision:"a8d0f7554007b5d7"},{url:"/_next/static/chunks/pages/conta-48a9e51444f593fe.js",revision:"48a9e51444f593fe"},{url:"/_next/static/chunks/pages/index-0561a52a4653c4e8.js",revision:"0561a52a4653c4e8"},{url:"/_next/static/chunks/pages/inicio-01f9bbb5f53b0400.js",revision:"01f9bbb5f53b0400"},{url:"/_next/static/chunks/pages/pedidos-aa7a9842791944f0.js",revision:"aa7a9842791944f0"},{url:"/_next/static/chunks/pages/pedidos/detalhe/%5Bslug%5D-4e744433364233fd.js",revision:"4e744433364233fd"},{url:"/_next/static/chunks/pages/pedidos/novo/%5B...slug%5D-5455c56f49aefc2c.js",revision:"5455c56f49aefc2c"},{url:"/_next/static/chunks/pages/produtos-2ed9186f3f031bf8.js",revision:"2ed9186f3f031bf8"},{url:"/_next/static/chunks/pages/produtos/%5Bcodigo%5D-e4eadc298948c202.js",revision:"e4eadc298948c202"},{url:"/_next/static/chunks/polyfills-5cd94c89d3acac5f.js",revision:"99442aec5788bccac9b2f0ead2afdd6b"},{url:"/_next/static/chunks/webpack-42cdea76c8170223.js",revision:"42cdea76c8170223"},{url:"/_next/static/css/4c4a5def203ddc71.css",revision:"4c4a5def203ddc71"},{url:"/apple-icon.png",revision:"d951ab3dc171a5e8c1ebed24b9ba7edb"},{url:"/assets/logo-white.png",revision:"4afe6a11e0a8c3372a89b77555323431"},{url:"/assets/nike_space/license.txt",revision:"cfa929fc0a15d0cd99b5e3a2fde9936e"},{url:"/assets/nike_space/scene.bin",revision:"ee2297a93cd2700dac037ca05ccf1ce2"},{url:"/assets/nike_space/scene.gltf",revision:"084078378d1b2ccfece2110aa5a05943"},{url:"/assets/nike_space/textures/SpaceHippie_RAW1002_defaultMat_baseColor.png",revision:"1438b83adf403edeee3a619ae847760c"},{url:"/assets/nike_space/textures/SpaceHippie_RAW1002_defaultMat_metallicRoughness.png",revision:"93939c3f635b8bd61405d02da0dcc40a"},{url:"/assets/nike_space/textures/SpaceHippie_RAW1002_defaultMat_normal.png",revision:"d36a8150fac3af8227f137568434ce38"},{url:"/assets/obj/vans_old/export/vans_old_skool_black__corona.3ds",revision:"a3e9e839db3f84b95d0a98ae280d45f1"},{url:"/assets/obj/vans_old/export/vans_old_skool_black__corona.mtl",revision:"54b452e3dd5da7dfec03ee07b2169113"},{url:"/assets/obj/vans_old/export/vans_old_skool_black__corona.obj",revision:"421f4b8f2fbf775d131c02909be6b002"},{url:"/assets/obj/vans_old/info.txt",revision:"29d4ed7508952c85adabffd134900123"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_NormalMap.png",revision:"39c5bd06c187cd815240df7902f6be61"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_bump.jpg",revision:"ca190323622284be16aab8166f95813f"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_fabrics_2.jpg",revision:"933562656757089ab5f62ffc2d79a03c"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_insole_diff.jpg",revision:"b8b7fa2ca43c7302a3755f3cd94d10dd"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_lace_1.jpg",revision:"18d39457c25c801e78dbb4e12e1e0a8e"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_leather_black.jpg",revision:"dbbac00dac8370d07edd81f465a9a557"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_leather_old_bump.png",revision:"2027e25b6ac43f8c1d3303dacda5d8c6"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_logo_diff.jpg",revision:"0fabfe2ab112cf047fef3f77ea68bb25"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_logo_displace.jpg",revision:"9c30a50dbac0ee0295a35a181be6fd47"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_reflect.jpg",revision:"a200bddd73c686f8b56073a52fa588b8"},{url:"/assets/obj/vans_old/matlib/vans_old_skool_black__corona.mat",revision:"56a252a76bef45597ec0cbfb1ff9551f"},{url:"/assets/obj/vans_old/vans_old_skool_black_2011__corona.max",revision:"c37cd673841c944cbbea47219fd6b1ff"},{url:"/assets/resources/gltf/normal.jpg",revision:"ff906b8366dd8a8d2131d500b435c2f2"},{url:"/assets/resources/gltf/occlusionRougnessMetalness.jpg",revision:"41b647df60dd2acdef31acdf7765ef94"},{url:"/assets/resources/gltf/shoe.bin",revision:"224b740c265b3c250b64ee5ad9238275"},{url:"/assets/resources/gltf/shoe.gltf",revision:"26e88f12de64c0b46a3ffbf1d15b547d"},{url:"/assets/resources/shoe.blend",revision:"5539a6e16fd7ebd080e3610d1f751819"},{url:"/favicon.png",revision:"96a1844a4e825e60fcf6f2ba3436ba68"},{url:"/icon-1024x1024.png",revision:"d951ab3dc171a5e8c1ebed24b9ba7edb"},{url:"/icon-16x16.png",revision:"0a4ebf1c06738bb0e1c1ff9c5c2b3dfd"},{url:"/icon-192x192.png",revision:"a6e404c0d903e665e604144c84b9a58f"},{url:"/icon-32x32.png",revision:"96a1844a4e825e60fcf6f2ba3436ba68"},{url:"/icon-512x512.png",revision:"064ad9ad41b9978d37d74e9eec2e4baa"},{url:"/manifest.json",revision:"56f409a49524e048dc3874a6c47fe03c"},{url:"/robots.txt",revision:"3a830b976af1533d0385101e643439ff"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
