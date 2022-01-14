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
  value: 'console.log("Hello, world")',
  language: 'javascript',
  automaticLayout:true,
  fontLigatures:true,
  fontFamily:'CascadiaCodePL',
  padding:{
    top:15,
  }
});
const $css = monaco.editor.create($('#css'), {
  value: 'console.log("Hello, world")',
  language: 'css',
  automaticLayout:true,
  fontLigatures:true,
  fontFamily:'CascadiaCodePL',
  padding:{
    top:15,
  }
});
const $html = monaco.editor.create($('#html'), {
  value: 'console.log("Hello, world")',
  language: 'html',
  automaticLayout:true,
  fontLigatures:true,
  fontFamily:'CascadiaCodePL',
  padding:{
    top:15,
  }
});;


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

// * Beautify for Ace
// ! URL SAVING SYSTEM
//.Pathname
let {
  pathname
} = document.location

//.Variables
const [rawHtml, rawCss, rawJs] = pathname.slice(1).split('%7C')
let deHtml = rawHtml ? decode(rawHtml) : localStorage.getItem('html');
let deCss = rawCss ? decode(rawCss) : localStorage.getItem('css');
let deJs = rawJs ? decode(rawJs) : localStorage.getItem('js');

//.Add decoded values to editors
$html.setValue(deHtml)
$css.setValue(deCss)
$js.setValue(deJs)

//.First update, automatic.
update();

emmetCSS(monaco)
emmetJSX(monaco)
emmetHTML(monaco)

// ! UPDATE FUNCTION
function update() {
  const hashedCode = `${encode($html.getValue())}|${encode($css.getValue())}|${encode($js.getValue())}`
  window.history.replaceState(null, null, `/${hashedCode}`);
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

  $('iframe').setAttribute('srcdoc', `
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
  `)
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
}