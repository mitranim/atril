'format cjs';
var viewCache = require('atril').viewCache;
viewCache.set('app/hello-world/hello-world.html', '<div class="space-out-v">\n  <!-- Updates automatically -->\n  <h1>Hello, {{name}}!</h1>\n\n  <!-- Two-way databinding -->\n  <label>\n    <input twoway.value="name" placeholder="I\'m two-way bound">\n  </label>\n\n  <!-- One-way databinding with manual feedback -->\n  <label>\n    <input bind.value="name" on.input="name = this.value" placeholder="I\'m manually wired">\n  </label>\n\n  <!-- One-way databinding with no feedback;\n       on.input is needed to detect user activity -->\n  <label>\n    <input bind.value="name" on.input placeholder="I\'m one-way bound">\n  </label>\n</div>\n');
viewCache.set('app/inner-component/inner-component.html', '<div class="space-out-v" bind.style.color="color" style="background-color: rgba(0, 0, 0, 0.02)">\n  <p>Bound `val` in inner component: {{val}}</p>\n\n  <p>`color` in inner component: {{color}}</p>\n\n  <input twoway.value="color" class="sf-input info">\n</div>\n');
viewCache.set('app/mock-component/mock-component.html', '<h1>Hello {{value}}!</h1>\n\n<p style="color: {{color}}">If you see \'Hello world\' or some mumbo-jumbo, the values have been successfully interpolated!</p>\n\n<inner-component bind.val="fetched" class="pad-ch"></inner-component>\n\n<div class="pad-ch">\n  <button if.="true" on.click="value = randomString()" class="sf-btn info">click me</button>\n\n  <div class="pad-ch" bind.style.display="\'inline-block\'">\n    <span for.char="value" class="sf-btn success">{{char}}</span>\n  </div>\n</div>\n\n<div class="pad-ch">\n  <input bind.value="inputValue" on.input="inputValue = this.value"\n         class="sf-input" placeholder="write into me">\n  <span>{{inputValue}}</span>\n</div>\n\n<div class="pad-ch">\n  <textarea twoway.value="inputValue"\n            class="sf-input" placeholder="I\'m two way bound"></textarea>\n  <span>{{inputValue}}</span>\n</div>\n\n<div class="pad-ch">\n  <label class="pad-ch" class.info="checked" class.warning="!checked">\n    <input twoway.checked="checked" type="checkbox">\n    <span>I\'m checked: {{checked}}</span>\n  </label>\n</div>\n');
viewCache.set('app/todo-item/todo-item.html', '<div class.success="item.completed" class.strikethrough="item.completed"\n     class.info="!item.completed" class.orange="isNew">\n  <label if.="!isNew">\n    <input twoway.checked="item.completed" type="checkbox">\n  </label>\n  <form on.submit="add()" onsubmit="return false">\n    <input twoway.value="item.text" bind.disabled="item.completed" required\n           placeholder="{{isNew ? \'Create a new task\' : \'Edit the task\'}}">\n    <button if.="isNew" svg-icon.="plus"></button>\n  </form>\n  <button on.click="remove()" if.="!isNew" svg-icon.="times"></button>\n</div>\n');
viewCache.set('app/todo-list/todo-list.html', '<todo-item bind.item="newItem" bind.is-new="true" on.add="add()"></todo-item>\n<todo-item for.item.of="items" bind.item="item" on.remove="remove(item)"></todo-item>\n');
viewCache.set('app/svg/arrows-h.svg', '<svg width="2048" height="2048" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg"><path d="M1920 1024q0 26-19 45l-256 256q-19 19-45 19t-45-19-19-45v-128h-1024v128q0 26-19 45t-45 19-45-19l-256-256q-19-19-19-45t19-45l256-256q19-19 45-19t45 19 19 45v128h1024v-128q0-26 19-45t45-19 45 19l256 256q19 19 19 45z"/></svg>');
viewCache.set('app/svg/bolt.svg', '<svg width="2048" height="2048" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg"><path d="M1461 694q18 20 7 44l-540 1157q-13 25-42 25-4 0-14-2-17-5-25.5-19t-4.5-30l197-808-406 101q-4 1-12 1-18 0-31-11-18-15-13-39l201-825q4-14 16-23t28-9h328q19 0 32 12.5t13 29.5q0 8-5 18l-171 463 396-98q8-2 12-2 19 0 34 15z"/></svg>');
viewCache.set('app/svg/cubes.svg', '<svg width="2048" height="2048" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg"><path d="M512 1760l384-192v-314l-384 164v342zm-64-454l404-173-404-173-404 173zm1088 454l384-192v-314l-384 164v342zm-64-454l404-173-404-173-404 173zm-448-293l384-165v-266l-384 164v267zm-64-379l441-189-441-189-441 189zm1088 518v416q0 36-19 67t-52 47l-448 224q-25 14-57 14t-57-14l-448-224q-5-2-7-4-2 2-7 4l-448 224q-25 14-57 14t-57-14l-448-224q-33-16-52-47t-19-67v-416q0-38 21.5-70t56.5-48l434-186v-400q0-38 21.5-70t56.5-48l448-192q23-10 50-10t50 10l448 192q35 16 56.5 48t21.5 70v400l434 186q36 16 57 48t21 70z"/></svg>');
viewCache.set('app/svg/info-circle.svg', '<svg width="2048" height="2048" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg"><path d="M1280 1504v-160q0-14-9-23t-23-9h-96v-512q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v160q0 14 9 23t23 9h96v320h-96q-14 0-23 9t-9 23v160q0 14 9 23t23 9h448q14 0 23-9t9-23zm-128-896v-160q0-14-9-23t-23-9h-192q-14 0-23 9t-9 23v160q0 14 9 23t23 9h192q14 0 23-9t9-23zm640 416q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/></svg>');
viewCache.set('app/svg/magic.svg', '<svg width="2048" height="2048" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg"><path d="M1382 709l293-293-107-107-293 293zm447-293q0 27-18 45l-1286 1286q-18 18-45 18t-45-18l-198-198q-18-18-18-45t18-45l1286-1286q18-18 45-18t45 18l198 198q18 18 18 45zm-1351-190l98 30-98 30-30 98-30-98-98-30 98-30 30-98zm350 162l196 60-196 60-60 196-60-196-196-60 196-60 60-196zm930 478l98 30-98 30-30 98-30-98-98-30 98-30 30-98zm-640-640l98 30-98 30-30 98-30-98-98-30 98-30 30-98z"/></svg>');
viewCache.set('app/svg/paper-plane-o.svg', '<svg width="2048" height="2048" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg"><path d="M1892 139q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-527-215-298 327q-18 21-47 21-14 0-23-4-19-7-30-23.5t-11-36.5v-452l-472-193q-37-14-40-55-3-39 32-59l1664-960q35-21 68 2zm-342 1499l221-1323-1434 827 336 137 863-639-478 797z"/></svg>');
viewCache.set('app/svg/plus.svg', '<svg width="2048" height="2048" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg"><path d="M1728 864v192q0 40-28 68t-68 28h-416v416q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-416h-416q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h416v-416q0-40 28-68t68-28h192q40 0 68 28t28 68v416h416q40 0 68 28t28 68z"/></svg>');
viewCache.set('app/svg/question-circle.svg', '<svg width="2048" height="2048" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg"><path d="M1152 1504v-192q0-14-9-23t-23-9h-192q-14 0-23 9t-9 23v192q0 14 9 23t23 9h192q14 0 23-9t9-23zm256-672q0-88-55.5-163t-138.5-116-170-41q-243 0-371 213-15 24 8 42l132 100q7 6 19 6 16 0 25-12 53-68 86-92 34-24 86-24 48 0 85.5 26t37.5 59q0 38-20 61t-68 45q-63 28-115.5 86.5t-52.5 125.5v36q0 14 9 23t23 9h192q14 0 23-9t9-23q0-19 21.5-49.5t54.5-49.5q32-18 49-28.5t46-35 44.5-48 28-60.5 12.5-81zm384 192q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/></svg>');
viewCache.set('app/svg/sitemap.svg', '<svg width="2048" height="2048" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg"><path d="M1920 1376v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192h-512v192h96q40 0 68 28t28 68v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192h-512v192h96q40 0 68 28t28 68v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192q0-52 38-90t90-38h512v-192h-96q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h320q40 0 68 28t28 68v320q0 40-28 68t-68 28h-96v192h512q52 0 90 38t38 90v192h96q40 0 68 28t28 68z"/></svg>');
viewCache.set('app/svg/times.svg', '<svg width="2048" height="2048" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg"><path d="M1618 1450q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/></svg>');
