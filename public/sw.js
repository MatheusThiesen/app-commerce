if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,n)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let d={};const t=e=>a(e,i),r={module:{uri:i},exports:d,require:t};s[i]=Promise.all(c.map((e=>r[e]||t(e)))).then((e=>(n(...e),d)))}}define(["./workbox-588899ac"],(function(e){"use strict";importScripts("fallback-JHKOjEyu9U7qcJ3ycni13.js"),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/JHKOjEyu9U7qcJ3ycni13/_buildManifest.js",revision:"64a8b5278c51367828b7a4d35e3c2af2"},{url:"/_next/static/JHKOjEyu9U7qcJ3ycni13/_middlewareManifest.js",revision:"fb2823d66b3e778e04a3f681d0d2fb19"},{url:"/_next/static/JHKOjEyu9U7qcJ3ycni13/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/031aa83e-d03d48a2ac8751ad.js",revision:"d03d48a2ac8751ad"},{url:"/_next/static/chunks/109-81ef9ac390f0b8e2.js",revision:"81ef9ac390f0b8e2"},{url:"/_next/static/chunks/1bfc9850-4426323459b5efcc.js",revision:"4426323459b5efcc"},{url:"/_next/static/chunks/252f366e-96435433039cd202.js",revision:"96435433039cd202"},{url:"/_next/static/chunks/292-e0538131e6b8eb06.js",revision:"e0538131e6b8eb06"},{url:"/_next/static/chunks/31664189-780a5347592d5498.js",revision:"780a5347592d5498"},{url:"/_next/static/chunks/353-376db2e9589c6687.js",revision:"376db2e9589c6687"},{url:"/_next/static/chunks/395-a2a244fc9c344c63.js",revision:"a2a244fc9c344c63"},{url:"/_next/static/chunks/430-fcaa35d78b2a0ad1.js",revision:"fcaa35d78b2a0ad1"},{url:"/_next/static/chunks/464-d03583677932d16a.js",revision:"d03583677932d16a"},{url:"/_next/static/chunks/545-97b617ccf28112d8.js",revision:"97b617ccf28112d8"},{url:"/_next/static/chunks/7-bf634055b42fc1c9.js",revision:"bf634055b42fc1c9"},{url:"/_next/static/chunks/725-557d2167e4d1c44b.js",revision:"557d2167e4d1c44b"},{url:"/_next/static/chunks/728-9ca48c1f981e8e16.js",revision:"9ca48c1f981e8e16"},{url:"/_next/static/chunks/731-8daafe2d15eadc16.js",revision:"8daafe2d15eadc16"},{url:"/_next/static/chunks/819-db909fbb91f2ccad.js",revision:"db909fbb91f2ccad"},{url:"/_next/static/chunks/896-d2e744248ddd34d6.js",revision:"d2e744248ddd34d6"},{url:"/_next/static/chunks/935-76a65ce3d42e07e5.js",revision:"76a65ce3d42e07e5"},{url:"/_next/static/chunks/939-13b9a12a380082fd.js",revision:"13b9a12a380082fd"},{url:"/_next/static/chunks/977-ed843b86b7c3a36d.js",revision:"ed843b86b7c3a36d"},{url:"/_next/static/chunks/98ea7ec2-d5d40c4d9163a861.js",revision:"d5d40c4d9163a861"},{url:"/_next/static/chunks/b98bc7c3-74a3777e8d853b12.js",revision:"74a3777e8d853b12"},{url:"/_next/static/chunks/d0447323-ddfba01c8c3f6fdc.js",revision:"ddfba01c8c3f6fdc"},{url:"/_next/static/chunks/d64684d8-8cbd355ed0ced08f.js",revision:"8cbd355ed0ced08f"},{url:"/_next/static/chunks/d7eeaac4-7c72d363f93e8dcd.js",revision:"7c72d363f93e8dcd"},{url:"/_next/static/chunks/de71a805-53a4beb64ad45eeb.js",revision:"53a4beb64ad45eeb"},{url:"/_next/static/chunks/framework-81da43a8dcd978d9.js",revision:"81da43a8dcd978d9"},{url:"/_next/static/chunks/main-6e12092787dc020b.js",revision:"6e12092787dc020b"},{url:"/_next/static/chunks/pages/_app-607c4bec30787ee8.js",revision:"607c4bec30787ee8"},{url:"/_next/static/chunks/pages/_error-0509152792d2b207.js",revision:"0509152792d2b207"},{url:"/_next/static/chunks/pages/_offline-2f96d26b3c392cd9.js",revision:"2f96d26b3c392cd9"},{url:"/_next/static/chunks/pages/catalogo/%5Bid%5D-f133dfdfe3aa7c3d.js",revision:"f133dfdfe3aa7c3d"},{url:"/_next/static/chunks/pages/clientes-e71f0ee758d363f6.js",revision:"e71f0ee758d363f6"},{url:"/_next/static/chunks/pages/clientes/%5Bcodigo%5D-477fb98ca17127da.js",revision:"477fb98ca17127da"},{url:"/_next/static/chunks/pages/conta-f70319d46c3df699.js",revision:"f70319d46c3df699"},{url:"/_next/static/chunks/pages/esquecido-c2cfdb7da5e76688.js",revision:"c2cfdb7da5e76688"},{url:"/_next/static/chunks/pages/index-1a61577bd6c45ca8.js",revision:"1a61577bd6c45ca8"},{url:"/_next/static/chunks/pages/inicio-754b539e6d8191ee.js",revision:"754b539e6d8191ee"},{url:"/_next/static/chunks/pages/mais-6cd45989d71ac9ee.js",revision:"6cd45989d71ac9ee"},{url:"/_next/static/chunks/pages/pedidos-3dbbcf0e36f0c7b0.js",revision:"3dbbcf0e36f0c7b0"},{url:"/_next/static/chunks/pages/pedidos/%5Bcodigo%5D-f2e44768a57da322.js",revision:"f2e44768a57da322"},{url:"/_next/static/chunks/pages/pedidos/novo-9fdf12b813063b62.js",revision:"9fdf12b813063b62"},{url:"/_next/static/chunks/pages/pedidos/novo/fechamento-241ef7d2cdf2dc42.js",revision:"241ef7d2cdf2dc42"},{url:"/_next/static/chunks/pages/pedidos/novo/produtos/%5Bcodigo%5D-931e9ee34042868e.js",revision:"931e9ee34042868e"},{url:"/_next/static/chunks/pages/produtos-48ddd2eefdac1aff.js",revision:"48ddd2eefdac1aff"},{url:"/_next/static/chunks/pages/produtos/%5Bcodigo%5D-28575925b68ab08b.js",revision:"28575925b68ab08b"},{url:"/_next/static/chunks/pages/resetar-bbd5ce7ccbfba70d.js",revision:"bbd5ce7ccbfba70d"},{url:"/_next/static/chunks/pages/sso/%5Btoken%5D-b7d7ae7f53a50af5.js",revision:"b7d7ae7f53a50af5"},{url:"/_next/static/chunks/polyfills-5cd94c89d3acac5f.js",revision:"99442aec5788bccac9b2f0ead2afdd6b"},{url:"/_next/static/chunks/webpack-42cdea76c8170223.js",revision:"42cdea76c8170223"},{url:"/_next/static/css/4e1716e79f40f70c.css",revision:"4e1716e79f40f70c"},{url:"/_next/static/css/c7452c2fccc3a295.css",revision:"c7452c2fccc3a295"},{url:"/_offline",revision:"JHKOjEyu9U7qcJ3ycni13"},{url:"/apple-icon.png",revision:"d951ab3dc171a5e8c1ebed24b9ba7edb"},{url:"/assets/logo-red.png",revision:"35e0041a96005d71576c097a99f92d66"},{url:"/assets/logo-white.png",revision:"4afe6a11e0a8c3372a89b77555323431"},{url:"/assets/nike_space/license.txt",revision:"cfa929fc0a15d0cd99b5e3a2fde9936e"},{url:"/assets/nike_space/scene.bin",revision:"ee2297a93cd2700dac037ca05ccf1ce2"},{url:"/assets/nike_space/scene.gltf",revision:"084078378d1b2ccfece2110aa5a05943"},{url:"/assets/nike_space/textures/SpaceHippie_RAW1002_defaultMat_baseColor.png",revision:"1438b83adf403edeee3a619ae847760c"},{url:"/assets/nike_space/textures/SpaceHippie_RAW1002_defaultMat_metallicRoughness.png",revision:"93939c3f635b8bd61405d02da0dcc40a"},{url:"/assets/nike_space/textures/SpaceHippie_RAW1002_defaultMat_normal.png",revision:"d36a8150fac3af8227f137568434ce38"},{url:"/assets/obj/vans_old/export/vans_old_skool_black__corona.3ds",revision:"a3e9e839db3f84b95d0a98ae280d45f1"},{url:"/assets/obj/vans_old/export/vans_old_skool_black__corona.mtl",revision:"54b452e3dd5da7dfec03ee07b2169113"},{url:"/assets/obj/vans_old/export/vans_old_skool_black__corona.obj",revision:"421f4b8f2fbf775d131c02909be6b002"},{url:"/assets/obj/vans_old/info.txt",revision:"29d4ed7508952c85adabffd134900123"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_NormalMap.png",revision:"39c5bd06c187cd815240df7902f6be61"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_bump.jpg",revision:"ca190323622284be16aab8166f95813f"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_fabrics_2.jpg",revision:"933562656757089ab5f62ffc2d79a03c"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_insole_diff.jpg",revision:"b8b7fa2ca43c7302a3755f3cd94d10dd"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_lace_1.jpg",revision:"18d39457c25c801e78dbb4e12e1e0a8e"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_leather_black.jpg",revision:"dbbac00dac8370d07edd81f465a9a557"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_leather_old_bump.png",revision:"2027e25b6ac43f8c1d3303dacda5d8c6"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_logo_diff.jpg",revision:"0fabfe2ab112cf047fef3f77ea68bb25"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_logo_displace.jpg",revision:"9c30a50dbac0ee0295a35a181be6fd47"},{url:"/assets/obj/vans_old/maps/vans_old_skool_black_reflect.jpg",revision:"a200bddd73c686f8b56073a52fa588b8"},{url:"/assets/obj/vans_old/matlib/vans_old_skool_black__corona.mat",revision:"56a252a76bef45597ec0cbfb1ff9551f"},{url:"/assets/obj/vans_old/vans_old_skool_black_2011__corona.max",revision:"c37cd673841c944cbbea47219fd6b1ff"},{url:"/assets/resources/gltf/normal.jpg",revision:"ff906b8366dd8a8d2131d500b435c2f2"},{url:"/assets/resources/gltf/occlusionRougnessMetalness.jpg",revision:"41b647df60dd2acdef31acdf7765ef94"},{url:"/assets/resources/gltf/shoe.bin",revision:"224b740c265b3c250b64ee5ad9238275"},{url:"/assets/resources/gltf/shoe.gltf",revision:"26e88f12de64c0b46a3ffbf1d15b547d"},{url:"/assets/resources/shoe.blend",revision:"5539a6e16fd7ebd080e3610d1f751819"},{url:"/favicon.png",revision:"96a1844a4e825e60fcf6f2ba3436ba68"},{url:"/icon-1024x1024.png",revision:"bdb1ed92c806ac9e6be50dfe1dd81ebd"},{url:"/icon-16x16.png",revision:"0a4ebf1c06738bb0e1c1ff9c5c2b3dfd"},{url:"/icon-192x192.png",revision:"a6e404c0d903e665e604144c84b9a58f"},{url:"/icon-32x32.png",revision:"96a1844a4e825e60fcf6f2ba3436ba68"},{url:"/icon-512x512.png",revision:"064ad9ad41b9978d37d74e9eec2e4baa"},{url:"/manifest.json",revision:"694810649f69ae8705f3ec317dd6b9dc"},{url:"/robots.txt",revision:"3a830b976af1533d0385101e643439ff"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s},{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET")}));
