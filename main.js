import './style.css'
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
let options = {
  automaticLayout:true,
  fontLigatures:true,
  fontFamily:'CascadiaCodePL',
  minimap: {
    enabled:false,
  },
  renderLineHighlight: "line",
  renderLineHighlightOnlyWhenFocus:true,
  cursorSmoothCaretAnimation:true,
  cursorBlinking:'smooth',

  padding:{
    top:25,
  }
}

import {
  realtimeUpdate
} from './settings';

//. $ funtion (one-line-jquery 😉)
const $ = sel => document.querySelector(sel)
const $$ = sel => document.querySelectorAll(sel)

//. Split JS (resizing)
Split(['#a', '#b'], {
  gutterSize: 8,
  cursor: 'col-resize'
})

Split(['#c', '#d'], {
  direction: 'vertical',
  sizes: [50, 50],
  gutterSize: 8,
  cursor: 'row-resize'
})

Split(['#e', '#f'], {
  direction: 'vertical',
  sizes: [50, 50],
  gutterSize: 8,
  cursor: 'row-resize'
})


// ! Create editors!
const $js = monaco.editor.create($('#js'), {
  ...options,
  language: 'javascript',
});
const $css = monaco.editor.create($('#css'), {
  ...options,
  language: 'css',
});
const $html = monaco.editor.create($('#html'), {
  ...options,
  language: 'html',
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
    html = decode(code[0]);
    css = decode(code[1]);
    js = decode(code[2]);
  }
  else {
    html = localStorage.getItem('html');
    css = localStorage.getItem('css');
    js = localStorage.getItem('js');
  }
  $html.setValue(html);
  $js.setValue(js);
  $css.setValue(css);
}
getURLCode();
//.First update, automatic.
update();

emmetCSS(monaco)
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
  if($('#autosave').checked) {
    updateURLCode($html.getValue(), $css.getValue(), $js.getValue());
  }
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