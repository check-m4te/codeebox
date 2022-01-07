import './style.css'
import Split from 'split-grid'
import { encode, decode } from 'js-base64'
import * as monaco from 'monaco-editor'
import { emmetHTML } from 'emmet-monaco-es'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import TypeScriptWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

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
	value: "<h1>Codee<span>Box</span></h1>",
	language: 'html',
  theme:'vs-dark',
  automaticLayout:true,
  fontSize:16,
  fontFamily: 'Cascadia Code PL',
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
	value: "//Press the JS icon to import npm modules",
	language: 'javascript',
  theme:'vs-dark',
  automaticLayout:true,
  fontLigatures:true,
  fontSize:16,
  fontFamily: 'Cascadia Code PL',
  minimap: {
		enabled: false
	},
    lineNumbers:false,
  padding:{
    top:25
  }
});

const $css = monaco.editor.create($('#css'), {
	value: 
`body {
  color: rgb(40, 0, 13);
  background-color: aliceblue;
  font-family: Arial, Helvetica, sans-serif;
}
  
span {
  background-color: orange;
  border-radius: 5px;
  padding: 5px;
  margin-left: 5px;
}`,
	language: 'css',
  theme:'vs-dark',
  automaticLayout:true,
  fontSize:16,
  fontFamily: 'Cascadia Code PL',
  fontLigatures:true,
  minimap: {
		enabled: false
	},
  padding:{
    top:25
  }
});

let {pathname} = document.location

const [rawHtml, rawCss, rawJs] = pathname.slice(1).split('%7C')
let deHtml = rawHtml ? decode(rawHtml) : $html.getValue();
let deCss = rawCss ? decode(rawCss) : $css.getValue();
let deJs = rawJs ? decode(rawJs) : $js.getValue();

$html.setValue(deHtml)
$css.setValue(deCss)
$js.setValue(deJs)


update();

console.log($html.getValue())
console.log($js.getValue())
console.log($css.getValue())

$html.onDidChangeModelContent(update)
$css.onDidChangeModelContent(update)
$js.onDidChangeModelContent(update)
import('monaco-themes/themes/Dominion Day.json')
  .then(data => {
      monaco.editor.defineTheme('monokai', data);
      monaco.editor.setTheme('monokai')
  })
  


function update() {
  const hashedCode = `${encode($html.getValue())}|${encode($css.getValue())}|${encode($js.getValue())}`
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
}