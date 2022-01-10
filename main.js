import './style.css'
import Split from 'split-grid'
import { encode, decode } from 'js-base64'
import * as monaco from 'monaco-editor'
import { emmetHTML } from 'emmet-monaco-es'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import TypeScriptWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import cssFormatMonaco from 'css-format-monaco'
import { realtimeUpdate } from './settings'

window.MonacoEnvironment = {
  getWorker: function(_, label) {
    if (label === "html") {
      return new HtmlWorker()
    }
    if (label === "javascript") {
      return new TypeScriptWorker()
    }
    if (label === "css") {
      return new CssWorker()
    }
  },
}


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

const $html = monaco.editor.create($('#html'), {
	value: "<h1>CodeeBox</h1>",
	language: 'html',
  theme:'vs-dark',
  automaticLayout:true,
  fontSize:18,
  fontFamily: 'CascadiaCodePL',
  fontLigatures:true,
  minimap: {
		enabled: false
	},
  padding:{
    top:25
  }
});
emmetHTML(monaco);

const $js = monaco.editor.create($('#js'), {
	value: "",
	language: 'javascript',
  theme:'vs-dark',
  automaticLayout:true,
  fontLigatures:true,
  fontSize:18,
  fontFamily: 'CascadiaCodePL',
  minimap: {
		enabled: false
	},
    lineNumbers:false,
  padding:{
    top:25
  }
});

const $css = monaco.editor.create($('#css'), {
	value: '',
	language: 'css',
  theme:'vs-dark',
  automaticLayout:true,
  fontSize:18,
  fontFamily: 'CascadiaCodePL',
  fontLigatures:true,
  minimap: {
		enabled: false
	},
  padding:{
    top:25
  }
});

let {search} = document.location

const [rawHtml, rawCss, rawJs] = search.slice(1).split('%7C')
let deHtml = rawHtml ? decode(rawHtml) : $html.getValue();
let deCss = rawCss ? decode(rawCss) : $css.getValue();
let deJs = rawJs ? decode(rawJs) : $js.getValue();

$html.setValue(deHtml)
$css.setValue(deCss)
$js.setValue(deJs)

const generateCssFormater = () => cssFormatMonaco(
  monaco,
  {
    indent_size: 2
  }
)

generateCssFormater()

update();

$html.onDidChangeModelContent(() => {
  if(realtimeUpdate)
    update();
})
$css.onDidChangeModelContent(() => {
  if(realtimeUpdate)
    update();
})
$js.onDidChangeModelContent(() => {
  if(realtimeUpdate)
    update();
})

function update() {
  const hashedCode = `?${encode($html.getValue())}|${encode($css.getValue())}|${encode($js.getValue())}`
  window.history.replaceState(null, null, `/${hashedCode}`);
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