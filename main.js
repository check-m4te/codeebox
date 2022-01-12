import './style.css'
import Split from 'split-grid'
import { encode, decode } from 'js-base64'
import { realtimeUpdate } from './settings'
import ace from 'ace-builds/src-noconflict/ace'
import emmet from 'ace-builds/src-noconflict/ext-emmet'
import 'ace-builds/src-noconflict/ext-prompt'
import 'ace-builds/src-noconflict/ext-beautify'

import('emmet-core');

const $ = sel => document.querySelector(sel)


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

const $html = ace.edit('html');
const $css = ace.edit('css');
const $js = ace.edit('js');
$html.$blockScrolling = Infinity
$js.$blockScrolling = Infinity
$css.$blockScrolling = Infinity

import('ace-builds/src-noconflict/ext-language_tools')
  .then(() => {
    $js.setOptions({
    enableBasicAutocompletion: true,
    useWorker:false,
    enableLiveAutocompletion: true
  });
  $html.setOptions({
    enableLiveAutocompletion: true,
    useWorker:false,
    enableBasicAutocompletion: true
  });
  $css.setOptions({
    enableLiveAutocompletion: true,
    useWorker:false,
    enableBasicAutocompletion: true
  });
  })


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

import('ace-builds/src-noconflict/theme-monokai')
  .then(()=>{
    $html.setTheme("ace/theme/monokai");
    $css.setTheme("ace/theme/monokai");
    $js.setTheme("ace/theme/monokai");
  })



$html.renderer.setPadding(16)
$css.renderer.setPadding(16)
$js.renderer.setPadding(16)


$html.renderer.setScrollMargin(10, 10)
$js.renderer.setScrollMargin(10, 10)
$css.renderer.setScrollMargin(10, 10)


$js.getSession().on('change', update);
$css.getSession().on('change', update);
$html.getSession().on('change', update);
var beautify = ace.require('ace/ext/beautify');
$js.commands.addCommands(beautify.commands);
$html.commands.addCommands(beautify.commands);
$css.commands.addCommands(beautify.commands);

$html.setOption('enableEmmet', true)

let {pathname} = document.location

const [rawHtml, rawCss, rawJs] = pathname.slice(1).split('%7C')
let deHtml = rawHtml ? decode(rawHtml) : $html.getValue();
let deCss = rawCss ? decode(rawCss) : $css.getValue();
let deJs = rawJs ? decode(rawJs) : $js.getValue();

$html.setValue(deHtml, -1)
$css.setValue(deCss, -1)
$js.setValue(deJs, -1)

update();
beautify.beautify($html.getSession());
beautify.beautify($css.getSession());
beautify.beautify($js.getSession());

function update() {
  
  const hashedCode = `${encode($html.getValue())}|${encode($css.getValue())}|${encode($js.getValue())}`
  window.history.replaceState(null, null, `/${hashedCode}`);
  //console.clear();
  let newJS = `
    <script>
      ${$js.getValue()}
    </script>
  `;
  if ($js.getValue().includes("import")){
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
}

export {
  $js,
  $html,
  $css,
  $,
  update,
}