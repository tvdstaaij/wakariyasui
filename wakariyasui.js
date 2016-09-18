// ==UserScript==
// @name wakariyasui
// @namespace tvdstaaij
// @version 0.1.0
// @description Generate kanji reading annotations
// @include *
// @grant GM_getResourceText
// @require https://raw.githubusercontent.com/mscdex/base91.js/master/lib/base91.js
// @require https://raw.githubusercontent.com/tvdstaaij/kuroshiro.js/greasemonkey/dist/browser/kuroshiro.min.js
// @resource base.dat.gz https://github.com/tvdstaaij/kuromoji.js/raw/greasemonkey/dict-base91/base.dat.gz
// @resource cc.dat.gz https://github.com/tvdstaaij/kuromoji.js/raw/greasemonkey/dict-base91/cc.dat.gz
// @resource check.dat.gz https://github.com/tvdstaaij/kuromoji.js/raw/greasemonkey/dict-base91/check.dat.gz
// @resource tid.dat.gz https://github.com/tvdstaaij/kuromoji.js/raw/greasemonkey/dict-base91/tid.dat.gz
// @resource tid_map.dat.gz https://github.com/tvdstaaij/kuromoji.js/raw/greasemonkey/dict-base91/tid_map.dat.gz
// @resource tid_pos.dat.gz https://github.com/tvdstaaij/kuromoji.js/raw/greasemonkey/dict-base91/tid_pos.dat.gz
// @resource unk.dat.gz https://github.com/tvdstaaij/kuromoji.js/raw/greasemonkey/dict-base91/unk.dat.gz
// @resource unk_char.dat.gz https://github.com/tvdstaaij/kuromoji.js/raw/greasemonkey/dict-base91/unk_char.dat.gz
// @resource unk_compat.dat.gz https://github.com/tvdstaaij/kuromoji.js/raw/greasemonkey/dict-base91/unk_compat.dat.gz
// @resource unk_invoke.dat.gz https://github.com/tvdstaaij/kuromoji.js/raw/greasemonkey/dict-base91/unk_invoke.dat.gz
// @resource unk_map.dat.gz https://github.com/tvdstaaij/kuromoji.js/raw/greasemonkey/dict-base91/unk_map.dat.gz
// @resource unk_pos.dat.gz https://github.com/tvdstaaij/kuromoji.js/raw/greasemonkey/dict-base91/unk_pos.dat.gz
// ==/UserScript==

// True: Script functionality is always loaded (performance hit!)
// False: Ctrl-Alt-W loads the script functionality
var IMMEDIATE_INIT = false;

(function(){
  var initialized = false;
  function triggerInit(e) {
    if (
      initialized ||
      e.keyCode !== getCharCode('W') ||
      e.metaKey || e.shiftKey ||
      !e.altKey || !e.ctrlKey
    ) return;
    initialized = true;
    init();
  }
  if (IMMEDIATE_INIT) init();
  else document.addEventListener('keydown', triggerInit, false);
})();

function init() {
  console.log('Loading kuroshiro');
  kuroshiro.init({dicPath: ''}, function(err) {
    if (err) {
      console.error('Failed to load kuroshiro:', err);
      return;
    }
    console.log('Kuroshiro ready, registering hotkeys');
    document.addEventListener('keydown', convertActiveElement, false);
  });
}

function convertActiveElement(e) {
  if (e.metaKey || !e.ctrlKey || !e.altKey) return;
  var options = null;
  var kanaType = e.shiftKey ? 'katakana' : 'hiragana';
  switch (e.keyCode) {
    case getCharCode('O'):
      options = {to: kanaType, mode: 'okurigana'};
      break;
    case getCharCode('K'):
      options = {to: kanaType, mode: 'normal'};
      break;
    case getCharCode('S'):
      options = {to: kanaType, mode: 'spaced'};
      break;
    case getCharCode('R'):
      options = {to: 'romaji', mode: e.shiftKey ? 'okurigana' : 'normal'};
      break;
  }
  if (!options) return;
  var curElement = document.activeElement;
  switch (curElement.tagName.toLowerCase()) {
    case 'textarea':
    case 'input':
      curElement.value = kuroshiro.convert(curElement.value, options);
      break;
    default:
      if (!curElement.getAttribute('contenteditable')) break;
      curElement.innerHTML = kuroshiro.convert(curElement.textContent, options);
  }
}

function getCharCode(str) {
  return str.charCodeAt(0);
}

