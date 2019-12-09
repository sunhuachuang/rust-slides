var RevealNotes=(function(){var notesPopup=null;function openNotes(notesFilePath){if(notesPopup&&!notesPopup.closed){notesPopup.focus();return;}
if(!notesFilePath){var jsFileLocation=document.querySelector('script[src$="notes.js"]').src;jsFileLocation=jsFileLocation.replace(/notes\.js(\?.*)?$/,'');notesFilePath=jsFileLocation+'notes.html';}
notesPopup=window.open(notesFilePath,'reveal.js - Notes','width=1100,height=700');if(!notesPopup){alert('Speaker view popup failed to open. Please make sure popups are allowed and reopen the speaker view.');return;}
function connect(){var connectInterval=setInterval(function(){notesPopup.postMessage(JSON.stringify({namespace:'reveal-notes',type:'connect',url:window.location.protocol+'//'+window.location.host+window.location.pathname+window.location.search,state:Reveal.getState()}),'*');},500);window.addEventListener('message',function(event){var data=JSON.parse(event.data);if(data&&data.namespace==='reveal-notes'&&data.type==='connected'){clearInterval(connectInterval);onConnected();}
if(data&&data.namespace==='reveal-notes'&&data.type==='call'){callRevealApi(data.methodName,data.arguments,data.callId);}});}
function callRevealApi(methodName,methodArguments,callId){var result=Reveal[methodName].apply(Reveal,methodArguments);notesPopup.postMessage(JSON.stringify({namespace:'reveal-notes',type:'return',result:result,callId:callId}),'*');}
function post(event){var slideElement=Reveal.getCurrentSlide(),notesElement=slideElement.querySelector('aside.notes'),fragmentElement=slideElement.querySelector('.current-fragment');var messageData={namespace:'reveal-notes',type:'state',notes:'',markdown:false,whitespace:'normal',state:Reveal.getState()};if(slideElement.hasAttribute('data-notes')){messageData.notes=slideElement.getAttribute('data-notes');messageData.whitespace='pre-wrap';}
if(fragmentElement){var fragmentNotes=fragmentElement.querySelector('aside.notes');if(fragmentNotes){notesElement=fragmentNotes;}
else if(fragmentElement.hasAttribute('data-notes')){messageData.notes=fragmentElement.getAttribute('data-notes');messageData.whitespace='pre-wrap';notesElement=null;}}
if(notesElement){messageData.notes=notesElement.innerHTML;messageData.markdown=typeof notesElement.getAttribute('data-markdown')==='string';}
notesPopup.postMessage(JSON.stringify(messageData),'*');}
function onConnected(){Reveal.addEventListener('slidechanged',post);Reveal.addEventListener('fragmentshown',post);Reveal.addEventListener('fragmenthidden',post);Reveal.addEventListener('overviewhidden',post);Reveal.addEventListener('overviewshown',post);Reveal.addEventListener('paused',post);Reveal.addEventListener('resumed',post);post();}
connect();}
return{init:function(){if(!/receiver/i.test(window.location.search)){if(window.location.search.match(/(\?|\&)notes/gi)!==null){openNotes();}
Reveal.addKeyBinding({keyCode:83,key:'S',description:'Speaker notes view'},function(){openNotes();});}},open:openNotes};})();Reveal.registerPlugin('notes',RevealNotes);