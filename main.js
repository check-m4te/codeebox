import './style.css'
import Split from 'split-grid'
import {
  encode,
  decode
} from 'js-base64'

// !MONACO
import * as monaco from 'monaco-editor'
import { emmetHTML, emmetJSX, emmetCSS } from 'emmet-monaco-es'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

const PARAMS = new URLSearchParams(window.location.search);

import {
  realtimeUpdate
} from './settings';

//. $ funtion (one-line-jquery 😉)
const $ = sel => document.querySelector(sel)
const $$ = sel => document.querySelectorAll(sel)

//. Split JS (resizing)
Split({
  columnGutters: [{
    track: 1,
    element: document.querySelector('.vertical-gutter'),
  }],
  rowGutters: [{
    track: 1,
    element: document.querySelector('.horizontal-gutter'),
  }]
})

// ! Create editors!
const $js = monaco.editor.create($('#js'), {
  language: 'javascript',
  automaticLayout:true,
  fontLigatures:true,
  fontFamily:'CascadiaCodePL',
  padding:{
    top:25,
  }
});
const $css = monaco.editor.create($('#css'), {
  language: 'css',
  automaticLayout:true,
  fontLigatures:true,
  fontFamily:'CascadiaCodePL',
  padding:{
    top:25,
  }
});
const $html = monaco.editor.create($('#html'), {
  language: 'html',
  automaticLayout:true,
  fontLigatures:true,
  fontFamily:'CascadiaCodePL',
  padding:{
    top:25,
  },
});


// * Editor configurations.

//.Events
$html.onDidChangeModelContent(() => {
  if(realtimeUpdate)
    update()
})
$css.onDidChangeModelContent(() => {
  if(realtimeUpdate)
    update()
})
$js.onDidChangeModelContent(() => {
  if(realtimeUpdate)
    update()
})

// ! URL
function updateURLCode(html, css, js) {
  let url = new URL(window.location);
  let codeBase64 = `${encode(html)}|_|${encode(css)}|_|${encode(js)}`;
  url.searchParams.set('code', codeBase64);
  window.history.replaceState('', 'CodeeBox', url);
}
function getURLCode() {
  const codeBase64 = PARAMS.get('code');
  let code, html, js, css = '';
  if(codeBase64){
    code = codeBase64.split('|_|');
    html = code[0];
    css = code[1];
    js = code[2];
  }
  else {
    html = '';
    css = '';
    js = '';
  }
  $html.setValue(decode(html));
  $js.setValue(decode(js));
  $css.setValue(decode(css));
}
getURLCode();
//.First update, automatic.
update();

emmetCSS(monaco)
emmetJSX(monaco)
emmetHTML(monaco)

// ! UPDATE FUNCTION
function update() {
  if (!location.href.includes('localhost')) {
    console.clear();
  }
  let newJS = `
    <script>
      ${$js.getValue()}
    </script>
  `;
  if ($js.getValue().includes("import")) {
    newJS = `
    <script type="module">
      ${$js.getValue()}
    </script>
    `
  }
  let htmlcomplete = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        ${$css.getValue()}
      </style>
    </head>
    <body>
      ${$html.getValue()}
      ${newJS}
    </body>
  </html>
`
  $('iframe').setAttribute('srcdoc', htmlcomplete)
  localStorage.setItem('html', $html.getValue())
  localStorage.setItem('css', $css.getValue())
  localStorage.setItem('js', $js.getValue())
}
// ! EXPORTS
export {
  $js,
  $html,
  $css,
  $,
  $$,
  update,
  updateURLCode,
}