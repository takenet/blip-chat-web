!function(root,factory){"object"==typeof exports&&"object"==typeof module?module.exports=factory():"function"==typeof define&&define.amd?define([],factory):"object"==typeof exports?exports.BlipWebSDK=factory():root.BlipWebSDK=factory()}(this,function(){return function(modules){function hotDownloadUpdateChunk(chunkId){var head=document.getElementsByTagName("head")[0],script=document.createElement("script");script.type="text/javascript",script.charset="utf-8",script.src=__webpack_require__.p+""+chunkId+"."+hotCurrentHash+".hot-update.js",head.appendChild(script)}function hotDownloadManifest(callback){if("undefined"==typeof XMLHttpRequest)return callback(new Error("No browser support"));try{var request=new XMLHttpRequest,requestPath=__webpack_require__.p+""+hotCurrentHash+".hot-update.json";request.open("GET",requestPath,!0),request.timeout=1e4,request.send(null)}catch(err){return callback(err)}request.onreadystatechange=function(){if(4===request.readyState)if(0===request.status)callback(new Error("Manifest request to "+requestPath+" timed out."));else if(404===request.status)callback();else if(200!==request.status&&304!==request.status)callback(new Error("Manifest request to "+requestPath+" failed."));else{try{var update=JSON.parse(request.responseText)}catch(e){return void callback(e)}callback(null,update)}}}function hotCreateRequire(moduleId){function ensure(chunkId,callback){"ready"===hotStatus&&hotSetStatus("prepare"),hotChunksLoading++,__webpack_require__.e(chunkId,function(){function finishChunkLoading(){hotChunksLoading--,"prepare"===hotStatus&&(hotWaitingFilesMap[chunkId]||hotEnsureUpdateChunk(chunkId),0===hotChunksLoading&&0===hotWaitingFiles&&hotUpdateDownloaded())}try{callback.call(null,fn)}finally{finishChunkLoading()}})}var me=installedModules[moduleId];if(!me)return __webpack_require__;var fn=function(request){return me.hot.active?installedModules[request]?(installedModules[request].parents.indexOf(moduleId)<0&&installedModules[request].parents.push(moduleId),me.children.indexOf(request)<0&&me.children.push(request)):hotCurrentParents=[moduleId]:(console.warn("[HMR] unexpected require("+request+") from disposed module "+moduleId),hotCurrentParents=[]),__webpack_require__(request)};for(var name in __webpack_require__)Object.prototype.hasOwnProperty.call(__webpack_require__,name)&&(canDefineProperty?Object.defineProperty(fn,name,function(name){return{configurable:!0,enumerable:!0,get:function(){return __webpack_require__[name]},set:function(value){__webpack_require__[name]=value}}}(name)):fn[name]=__webpack_require__[name]);return canDefineProperty?Object.defineProperty(fn,"e",{enumerable:!0,value:ensure}):fn.e=ensure,fn}function hotCreateModule(moduleId){var hot={_acceptedDependencies:{},_declinedDependencies:{},_selfAccepted:!1,_selfDeclined:!1,_disposeHandlers:[],active:!0,accept:function(dep,callback){if("undefined"==typeof dep)hot._selfAccepted=!0;else if("function"==typeof dep)hot._selfAccepted=dep;else if("object"==typeof dep)for(var i=0;i<dep.length;i++)hot._acceptedDependencies[dep[i]]=callback;else hot._acceptedDependencies[dep]=callback},decline:function(dep){if("undefined"==typeof dep)hot._selfDeclined=!0;else if("number"==typeof dep)hot._declinedDependencies[dep]=!0;else for(var i=0;i<dep.length;i++)hot._declinedDependencies[dep[i]]=!0},dispose:function(callback){hot._disposeHandlers.push(callback)},addDisposeHandler:function(callback){hot._disposeHandlers.push(callback)},removeDisposeHandler:function(callback){var idx=hot._disposeHandlers.indexOf(callback);idx>=0&&hot._disposeHandlers.splice(idx,1)},check:hotCheck,apply:hotApply,status:function(l){return l?void hotStatusHandlers.push(l):hotStatus},addStatusHandler:function(l){hotStatusHandlers.push(l)},removeStatusHandler:function(l){var idx=hotStatusHandlers.indexOf(l);idx>=0&&hotStatusHandlers.splice(idx,1)},data:hotCurrentModuleData[moduleId]};return hot}function hotSetStatus(newStatus){hotStatus=newStatus;for(var i=0;i<hotStatusHandlers.length;i++)hotStatusHandlers[i].call(null,newStatus)}function toModuleId(id){var isNumber=+id+""===id;return isNumber?+id:id}function hotCheck(apply,callback){if("idle"!==hotStatus)throw new Error("check() is only allowed in idle status");"function"==typeof apply?(hotApplyOnUpdate=!1,callback=apply):(hotApplyOnUpdate=apply,callback=callback||function(err){if(err)throw err}),hotSetStatus("check"),hotDownloadManifest(function(err,update){if(err)return callback(err);if(!update)return hotSetStatus("idle"),void callback(null,null);hotRequestedFilesMap={},hotAvailibleFilesMap={},hotWaitingFilesMap={};for(var i=0;i<update.c.length;i++)hotAvailibleFilesMap[update.c[i]]=!0;hotUpdateNewHash=update.h,hotSetStatus("prepare"),hotCallback=callback,hotUpdate={};var chunkId=0;hotEnsureUpdateChunk(chunkId),"prepare"===hotStatus&&0===hotChunksLoading&&0===hotWaitingFiles&&hotUpdateDownloaded()})}function hotAddUpdateChunk(chunkId,moreModules){if(hotAvailibleFilesMap[chunkId]&&hotRequestedFilesMap[chunkId]){hotRequestedFilesMap[chunkId]=!1;for(var moduleId in moreModules)Object.prototype.hasOwnProperty.call(moreModules,moduleId)&&(hotUpdate[moduleId]=moreModules[moduleId]);0===--hotWaitingFiles&&0===hotChunksLoading&&hotUpdateDownloaded()}}function hotEnsureUpdateChunk(chunkId){hotAvailibleFilesMap[chunkId]?(hotRequestedFilesMap[chunkId]=!0,hotWaitingFiles++,hotDownloadUpdateChunk(chunkId)):hotWaitingFilesMap[chunkId]=!0}function hotUpdateDownloaded(){hotSetStatus("ready");var callback=hotCallback;if(hotCallback=null,callback)if(hotApplyOnUpdate)hotApply(hotApplyOnUpdate,callback);else{var outdatedModules=[];for(var id in hotUpdate)Object.prototype.hasOwnProperty.call(hotUpdate,id)&&outdatedModules.push(toModuleId(id));callback(null,outdatedModules)}}function hotApply(options,callback){function getAffectedStuff(module){for(var outdatedModules=[module],outdatedDependencies={},queue=outdatedModules.slice();queue.length>0;){var moduleId=queue.pop(),module=installedModules[moduleId];if(module&&!module.hot._selfAccepted){if(module.hot._selfDeclined)return new Error("Aborted because of self decline: "+moduleId);if(0===moduleId)return;for(var i=0;i<module.parents.length;i++){var parentId=module.parents[i],parent=installedModules[parentId];if(parent.hot._declinedDependencies[moduleId])return new Error("Aborted because of declined dependency: "+moduleId+" in "+parentId);outdatedModules.indexOf(parentId)>=0||(parent.hot._acceptedDependencies[moduleId]?(outdatedDependencies[parentId]||(outdatedDependencies[parentId]=[]),addAllToSet(outdatedDependencies[parentId],[moduleId])):(delete outdatedDependencies[parentId],outdatedModules.push(parentId),queue.push(parentId)))}}}return[outdatedModules,outdatedDependencies]}function addAllToSet(a,b){for(var i=0;i<b.length;i++){var item=b[i];a.indexOf(item)<0&&a.push(item)}}if("ready"!==hotStatus)throw new Error("apply() is only allowed in ready status");"function"==typeof options?(callback=options,options={}):options&&"object"==typeof options?callback=callback||function(err){if(err)throw err}:(options={},callback=callback||function(err){if(err)throw err});var outdatedDependencies={},outdatedModules=[],appliedUpdate={};for(var id in hotUpdate)if(Object.prototype.hasOwnProperty.call(hotUpdate,id)){var moduleId=toModuleId(id),result=getAffectedStuff(moduleId);if(!result){if(options.ignoreUnaccepted)continue;return hotSetStatus("abort"),callback(new Error("Aborted because "+moduleId+" is not accepted"))}if(result instanceof Error)return hotSetStatus("abort"),callback(result);appliedUpdate[moduleId]=hotUpdate[moduleId],addAllToSet(outdatedModules,result[0]);for(var moduleId in result[1])Object.prototype.hasOwnProperty.call(result[1],moduleId)&&(outdatedDependencies[moduleId]||(outdatedDependencies[moduleId]=[]),addAllToSet(outdatedDependencies[moduleId],result[1][moduleId]))}for(var outdatedSelfAcceptedModules=[],i=0;i<outdatedModules.length;i++){var moduleId=outdatedModules[i];installedModules[moduleId]&&installedModules[moduleId].hot._selfAccepted&&outdatedSelfAcceptedModules.push({module:moduleId,errorHandler:installedModules[moduleId].hot._selfAccepted})}hotSetStatus("dispose");for(var queue=outdatedModules.slice();queue.length>0;){var moduleId=queue.pop(),module=installedModules[moduleId];if(module){for(var data={},disposeHandlers=module.hot._disposeHandlers,j=0;j<disposeHandlers.length;j++){var cb=disposeHandlers[j];cb(data)}hotCurrentModuleData[moduleId]=data,module.hot.active=!1,delete installedModules[moduleId];for(var j=0;j<module.children.length;j++){var child=installedModules[module.children[j]];if(child){var idx=child.parents.indexOf(moduleId);idx>=0&&child.parents.splice(idx,1)}}}}for(var moduleId in outdatedDependencies)if(Object.prototype.hasOwnProperty.call(outdatedDependencies,moduleId))for(var module=installedModules[moduleId],moduleOutdatedDependencies=outdatedDependencies[moduleId],j=0;j<moduleOutdatedDependencies.length;j++){var dependency=moduleOutdatedDependencies[j],idx=module.children.indexOf(dependency);idx>=0&&module.children.splice(idx,1)}hotSetStatus("apply"),hotCurrentHash=hotUpdateNewHash;for(var moduleId in appliedUpdate)Object.prototype.hasOwnProperty.call(appliedUpdate,moduleId)&&(modules[moduleId]=appliedUpdate[moduleId]);var error=null;for(var moduleId in outdatedDependencies)if(Object.prototype.hasOwnProperty.call(outdatedDependencies,moduleId)){for(var module=installedModules[moduleId],moduleOutdatedDependencies=outdatedDependencies[moduleId],callbacks=[],i=0;i<moduleOutdatedDependencies.length;i++){var dependency=moduleOutdatedDependencies[i],cb=module.hot._acceptedDependencies[dependency];callbacks.indexOf(cb)>=0||callbacks.push(cb)}for(var i=0;i<callbacks.length;i++){var cb=callbacks[i];try{cb(outdatedDependencies)}catch(err){error||(error=err)}}}for(var i=0;i<outdatedSelfAcceptedModules.length;i++){var item=outdatedSelfAcceptedModules[i],moduleId=item.module;hotCurrentParents=[moduleId];try{__webpack_require__(moduleId)}catch(err){if("function"==typeof item.errorHandler)try{item.errorHandler(err)}catch(err){error||(error=err)}else error||(error=err)}}return error?(hotSetStatus("fail"),callback(error)):(hotSetStatus("idle"),void callback(null,outdatedModules))}function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:!1,hot:hotCreateModule(moduleId),parents:hotCurrentParents,children:[]};return modules[moduleId].call(module.exports,module,module.exports,hotCreateRequire(moduleId)),module.loaded=!0,module.exports}var parentHotUpdateCallback=this.webpackHotUpdateBlipWebSDK;this.webpackHotUpdateBlipWebSDK=function(chunkId,moreModules){hotAddUpdateChunk(chunkId,moreModules),parentHotUpdateCallback&&parentHotUpdateCallback(chunkId,moreModules)};var canDefineProperty=!1;try{Object.defineProperty({},"x",{get:function(){}}),canDefineProperty=!0}catch(x){}var hotCallback,hotUpdate,hotUpdateNewHash,hotApplyOnUpdate=!0,hotCurrentHash="2da93a2f731a93d538a9",hotCurrentModuleData={},hotCurrentParents=[],hotStatusHandlers=[],hotStatus="idle",hotWaitingFiles=0,hotChunksLoading=0,hotWaitingFilesMap={},hotRequestedFilesMap={},hotAvailibleFilesMap={},installedModules={};return __webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.p="",__webpack_require__.h=function(){return hotCurrentHash},hotCreateRequire(0)(0)}([function(module,exports,__webpack_require__){module.exports=__webpack_require__(1)},function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}Object.defineProperty(exports,"__esModule",{value:!0});var _ChatBuilder=__webpack_require__(2);Object.defineProperty(exports,"ChatBuilder",{enumerable:!0,get:function(){return _interopRequireDefault(_ChatBuilder).default}})},function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),_Application=__webpack_require__(3),_Application2=_interopRequireDefault(_Application),ChatBuilder=function(){function ChatBuilder(){_classCallCheck(this,ChatBuilder),this._application=new _Application2.default}return _createClass(ChatBuilder,[{key:"withApiKey",value:function(apiKey){return this._application._apiKey=apiKey,this}},{key:"build",value:function(){this._application.openBlipThread()}}]),ChatBuilder}();exports.default=ChatBuilder},function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),_style=__webpack_require__(4),_chat=(_interopRequireDefault(_style),__webpack_require__(8)),_chat2=_interopRequireDefault(_chat),Application=function(){function Application(){_classCallCheck(this,Application),this.APIURL="https://api.0mn.io/partners",this.IFRAMEURL_HMG="https://hmg-blip-sdk.azurewebsites.net/chat",this.IFRAMEURL_LOCAL="http://localhost:3000/chat",this.IFRAMEURL_PRD="https://blip-sdk.azurewebsites.net/chat",this.IFRAMEURL=this.IFRAMEURL_LOCAL,this.IFRAMEURL=this.IFRAMEURL_HMG}return _createClass(Application,[{key:"openBlipThread",value:function(){var params="apikey="+this._apiKey;this.buildChat(params)}},{key:"buildChat",value:function(params){var body=document.getElementsByTagName("body")[0],chatDiv=document.createElement("div");chatDiv.id="take-chat",chatDiv.className="blip-hidden-chat",chatDiv.innerHTML=_chat2.default,body.appendChild(chatDiv);var chatIframe=document.createElement("iframe");chatIframe.width=290,chatIframe.height=400,chatIframe.src=this.IFRAMEURL+"?"+params,chatDiv.appendChild(chatIframe);var closeBtn=document.getElementById("blip-close-btn");closeBtn.addEventListener("click",function(){"blip-hidden-chat"==chatDiv.getAttribute("class")?chatDiv.setAttribute("class","blip-show-chat"):chatDiv.setAttribute("class","blip-hidden-chat")})}}]),Application}();exports.default=Application},function(module,exports,__webpack_require__){var content=__webpack_require__(5);"string"==typeof content&&(content=[[module.id,content,""]]);var update=__webpack_require__(7)(content,{});content.locals&&(module.exports=content.locals),content.locals||module.hot.accept(5,function(){var newContent=__webpack_require__(5);"string"==typeof newContent&&(newContent=[[module.id,newContent,""]]),update(newContent)}),module.hot.dispose(function(){update()})},function(module,exports,__webpack_require__){exports=module.exports=__webpack_require__(6)(),exports.push([module.id,"#take-chat{background:#546e7a;color:#fff;position:fixed;bottom:0;right:10px;padding:40px 0 14px;overflow:hidden;transition:.7s;border-radius:10px 10px 0 0;box-shadow:0 0 20px 1px rgba(0,0,0,.26);font-family:Helvetica Neue,Helvetica,Arial,sans-serif;line-height:1.42857143}#take-chat iframe{border:0}#blip-close-btn{position:absolute;top:6px;left:10px;width:100%;font-size:12px;font-weight:700;cursor:pointer}#blip-close-btn img{max-width:25px;margin-right:5px;vertical-align:middle}.blip-footer{position:absolute;bottom:1px;right:5px;font-size:12px;font-weight:700;cursor:pointer;color:#fff}.blip-hidden-chat{bottom:-430px!important}.blip-show-chat{bottom:0}",""])},function(module,exports){module.exports=function(){var list=[];return list.toString=function(){for(var result=[],i=0;i<this.length;i++){var item=this[i];item[2]?result.push("@media "+item[2]+"{"+item[1]+"}"):result.push(item[1])}return result.join("")},list.i=function(modules,mediaQuery){"string"==typeof modules&&(modules=[[null,modules,""]]);for(var alreadyImportedModules={},i=0;i<this.length;i++){var id=this[i][0];"number"==typeof id&&(alreadyImportedModules[id]=!0)}for(i=0;i<modules.length;i++){var item=modules[i];"number"==typeof item[0]&&alreadyImportedModules[item[0]]||(mediaQuery&&!item[2]?item[2]=mediaQuery:mediaQuery&&(item[2]="("+item[2]+") and ("+mediaQuery+")"),list.push(item))}},list}},function(module,exports,__webpack_require__){function addStylesToDom(styles,options){for(var i=0;i<styles.length;i++){var item=styles[i],domStyle=stylesInDom[item.id];if(domStyle){domStyle.refs++;for(var j=0;j<domStyle.parts.length;j++)domStyle.parts[j](item.parts[j]);for(;j<item.parts.length;j++)domStyle.parts.push(addStyle(item.parts[j],options))}else{for(var parts=[],j=0;j<item.parts.length;j++)parts.push(addStyle(item.parts[j],options));stylesInDom[item.id]={id:item.id,refs:1,parts:parts}}}}function listToStyles(list){for(var styles=[],newStyles={},i=0;i<list.length;i++){var item=list[i],id=item[0],css=item[1],media=item[2],sourceMap=item[3],part={css:css,media:media,sourceMap:sourceMap};newStyles[id]?newStyles[id].parts.push(part):styles.push(newStyles[id]={id:id,parts:[part]})}return styles}function insertStyleElement(options,styleElement){var head=getHeadElement(),lastStyleElementInsertedAtTop=styleElementsInsertedAtTop[styleElementsInsertedAtTop.length-1];if("top"===options.insertAt)lastStyleElementInsertedAtTop?lastStyleElementInsertedAtTop.nextSibling?head.insertBefore(styleElement,lastStyleElementInsertedAtTop.nextSibling):head.appendChild(styleElement):head.insertBefore(styleElement,head.firstChild),styleElementsInsertedAtTop.push(styleElement);else{if("bottom"!==options.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");head.appendChild(styleElement)}}function removeStyleElement(styleElement){styleElement.parentNode.removeChild(styleElement);var idx=styleElementsInsertedAtTop.indexOf(styleElement);idx>=0&&styleElementsInsertedAtTop.splice(idx,1)}function createStyleElement(options){var styleElement=document.createElement("style");return styleElement.type="text/css",insertStyleElement(options,styleElement),styleElement}function createLinkElement(options){var linkElement=document.createElement("link");return linkElement.rel="stylesheet",insertStyleElement(options,linkElement),linkElement}function addStyle(obj,options){var styleElement,update,remove;if(options.singleton){var styleIndex=singletonCounter++;styleElement=singletonElement||(singletonElement=createStyleElement(options)),update=applyToSingletonTag.bind(null,styleElement,styleIndex,!1),remove=applyToSingletonTag.bind(null,styleElement,styleIndex,!0)}else obj.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(styleElement=createLinkElement(options),update=updateLink.bind(null,styleElement),remove=function(){removeStyleElement(styleElement),styleElement.href&&URL.revokeObjectURL(styleElement.href)}):(styleElement=createStyleElement(options),update=applyToTag.bind(null,styleElement),remove=function(){removeStyleElement(styleElement)});return update(obj),function(newObj){if(newObj){if(newObj.css===obj.css&&newObj.media===obj.media&&newObj.sourceMap===obj.sourceMap)return;update(obj=newObj)}else remove()}}function applyToSingletonTag(styleElement,index,remove,obj){var css=remove?"":obj.css;if(styleElement.styleSheet)styleElement.styleSheet.cssText=replaceText(index,css);else{var cssNode=document.createTextNode(css),childNodes=styleElement.childNodes;childNodes[index]&&styleElement.removeChild(childNodes[index]),childNodes.length?styleElement.insertBefore(cssNode,childNodes[index]):styleElement.appendChild(cssNode)}}function applyToTag(styleElement,obj){var css=obj.css,media=obj.media;if(media&&styleElement.setAttribute("media",media),styleElement.styleSheet)styleElement.styleSheet.cssText=css;else{for(;styleElement.firstChild;)styleElement.removeChild(styleElement.firstChild);styleElement.appendChild(document.createTextNode(css))}}function updateLink(linkElement,obj){var css=obj.css,sourceMap=obj.sourceMap;sourceMap&&(css+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))))+" */");var blob=new Blob([css],{type:"text/css"}),oldSrc=linkElement.href;linkElement.href=URL.createObjectURL(blob),oldSrc&&URL.revokeObjectURL(oldSrc)}var stylesInDom={},memoize=function(fn){var memo;return function(){return"undefined"==typeof memo&&(memo=fn.apply(this,arguments)),memo}},isOldIE=memoize(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),getHeadElement=memoize(function(){return document.head||document.getElementsByTagName("head")[0]}),singletonElement=null,singletonCounter=0,styleElementsInsertedAtTop=[];module.exports=function(list,options){options=options||{},"undefined"==typeof options.singleton&&(options.singleton=isOldIE()),"undefined"==typeof options.insertAt&&(options.insertAt="bottom");var styles=listToStyles(list);return addStylesToDom(styles,options),function(newList){for(var mayRemove=[],i=0;i<styles.length;i++){var item=styles[i],domStyle=stylesInDom[item.id];domStyle.refs--,mayRemove.push(domStyle)}if(newList){var newStyles=listToStyles(newList);addStylesToDom(newStyles,options)}for(var i=0;i<mayRemove.length;i++){var domStyle=mayRemove[i];if(0===domStyle.refs){for(var j=0;j<domStyle.parts.length;j++)domStyle.parts[j]();delete stylesInDom[domStyle.id]}}}};var replaceText=function(){var textStore=[];return function(index,replacement){return textStore[index]=replacement,textStore.filter(Boolean).join("\n")}}()},function(module,exports){module.exports="<div id=blip-close-btn> <span><img src=http://blog.blip.ai/assets/img/icons/blip-app-white.png> Estamos Online</span> </div> <a class=blip-footer href=https://blip.ai target=_blank>blip.ai</a> "}])});