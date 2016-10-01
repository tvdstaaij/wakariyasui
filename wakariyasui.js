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

(function(){
    var initState = 'idle';
    document.addEventListener('keydown', function(e) {
        var action = decideAction(e);
        if (!action) return;
        switch (initState) {
            case 'ready':
                action();
                break;
            case 'idle':
                initState = 'initializing';
                console.log('Loading kuroshiro');
                kuroshiro.init({dicPath: ''}, function(err) {
                    if (err) {
                        console.error('Failed to load kuroshiro:', err);
                        initState = 'idle';
                        return;
                    }
                    initState = 'ready';
                    console.log('Kuroshiro ready');
                    action();
                });
                break;
        }
    }, false);
})();

function decideAction(e) {
    if (e.metaKey || !e.ctrlKey || !e.altKey) return null;
    var action = null;

    var kanaType = e.shiftKey ? 'katakana' : 'hiragana';
    switch (e.keyCode) {
        case getCharCode('W'):
            action = function(){}; // Just init
            break;
        case getCharCode('A'):
            action = annotateTextNodes;
            break;
        case getCharCode('O'):
            action = annotateInput.bind(this, {to: kanaType, mode: 'okurigana'});
            break;
        case getCharCode('K'):
            action = annotateInput.bind(this, {to: kanaType, mode: 'normal'});
            break;
        case getCharCode('S'):
            action = annotateInput.bind(this, {to: kanaType, mode: 'spaced'});
            break;
        case getCharCode('R'):
            action = annotateInput.bind(this, {to: 'romaji', mode: e.shiftKey ? 'okurigana' : 'normal'});
            break;
    }
    return action;
}

function annotateInput(options) {
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

function annotateTextNodes() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    var node, kanjiNodes = [];
    while (node = walker.nextNode()) {
        tagName = node.parentElement? node.parentElement.tagName : '';
        if (tagName === 'SCRIPT' || tagName === 'STYLE' || tagName === 'RUBY' ||
            tagName === 'RB' || tagName === 'RT') continue;
        if (!kuroshiro.hasKanji(node.nodeValue)) continue;
        kanjiNodes.push(node);
    }
    console.log('Annotating ' + String(kanjiNodes.length) + ' elements containing kanji');
    kanjiNodes.forEach(function(node) {
       var text = node.nodeValue;
       var annotatedText;
       try {
          annotatedText = kuroshiro.convert(text, {to: 'hiragana', mode: 'furigana'});
       } catch (err) {
           console.error('Kuroshiro:', err);
       }
       if (annotatedText === undefined) return;
       var annotatedNode = document.createElement('span');
       annotatedNode.innerHTML = annotatedText;
       node.parentNode.replaceChild(annotatedNode, node);
    });
}

function getCharCode(str) {
    return str.charCodeAt(0);
}
