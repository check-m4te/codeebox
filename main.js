import './style.css'
import Split from 'split-grid'
import {
  encode,
  decode
} from 'js-base64'

// ! ACE IMPORTS
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/ext-emmet'
import 'ace-builds/src-noconflict/ext-prompt'
import 'ace-builds/src-noconflict/ext-beautify'
import 'ace-builds/src-noconflict/ext-searchbox'
import 'ace-builds/src-noconflict/ext-code_lens'
import 'ace-builds/src-noconflict/ext-error_marker'
import 'ace-builds/src-noconflict/ext-hardwrap'
import 'ace-builds/src-noconflict/ext-keybinding_menu'
import 'ace-builds/src-noconflict/keybinding-vscode'
import('./emmet');
import {
  realtimeUpdate,
  setMonTheme,
  setLineNumbers
} from './settings';

//. $ funtion (one-line-jquery 😉)
const $ = sel => document.querySelector(sel)

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
const $html = ace.edit('html');
const $css = ace.edit('css');
const $js = ace.edit('js');

// * Editor configurations.

//.Remove scroll block
$html.$blockScrolling = Infinity;
$js.$blockScrolling = Infinity;
$css.$blockScrolling = Infinity;

//. Autocomplete
import('ace-builds/src-noconflict/ext-language_tools')
  .then(() => {
    $js.setOptions({
      enableBasicAutocompletion: true,
      useWorker: false,
      enableLiveAutocompletion: true
    });
    $html.setOptions({
      enableLiveAutocompletion: true,
      useWorker: false,
      enableBasicAutocompletion: true
    });
    $css.setOptions({
      enableLiveAutocompletion: true,
      useWorker: false,
      enableBasicAutocompletion: true
    });
  })

//.Modes
import('ace-builds/src-noconflict/mode-html')
  .then(() => {
    $html.getSession().setMode("ace/mode/html");
  })
import('ace-builds/src-noconflict/mode-javascript')
  .then(() => {
    $js.getSession().setMode("ace/mode/javascript");
  })
import('ace-builds/src-noconflict/mode-css')
  .then(() => {
    $css.getSession().setMode("ace/mode/css");
  })

//.Padding
$html.renderer.setPadding(16)
$css.renderer.setPadding(16)
$js.renderer.setPadding(16)

//.Scroll margin (top padding)
$html.renderer.setScrollMargin(14, 14)
$js.renderer.setScrollMargin(14, 14)
$css.renderer.setScrollMargin(14, 14)

//.Update on change
$js.getSession().on('change', () => {
  if (realtimeUpdate)
    update();
});
$css.getSession().on('change', () => {
  if (realtimeUpdate)
    update();
});
$html.getSession().on('change', () => {
  if (realtimeUpdate)
    update();
});

// * Beautify for Ace

//.Import
var beautify = ace.require('ace/ext/beautify');
//.Add shortcuts
$js.commands.addCommands(beautify.commands);
$html.commands.addCommands(beautify.commands);
$css.commands.addCommands(beautify.commands);

// * Emmet for Ace

$html.setOption('enableEmmet', true)
$css.setOption('enableEmmet', true)
$js.setOption('enableEmmet', true)

// ! CODELENS

$js.setOption("enableCodeLens", true);

// ! URL SAVING SYSTEM
//.Pathname
let {
  pathname
} = document.location

//.Variables
const [rawHtml, rawCss, rawJs] = pathname.slice(1).split('%7C')
let deHtml = rawHtml ? decode(rawHtml) : localStorage.getItem('html');
let deCss = rawCss ? decode(rawCss) :localStorage.getItem('css');
let deJs = rawJs ? decode(rawJs) : localStorage.getItem('js');

//.Add decoded values to editors
$html.setValue(deHtml, -1)
$css.setValue(deCss, -1)
$js.setValue(deJs, -1)

//.First update, automatic.
update();

//.Beautify for the first time
setTimeout(() => {
  beautify.beautify($html.getSession());
  beautify.beautify($css.getSession());
  beautify.beautify($js.getSession());
}, 500);

// ! UPDATE FUNCTION
function update() {

  const hashedCode = `${encode($html.getValue())}|${encode($css.getValue())}|${encode($js.getValue())}`
  window.history.replaceState(null, null, `/${hashedCode}`);
  !(window.location.href.includes('localhost:3000')) ? console.clear(): console.log('');
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
  update,
}