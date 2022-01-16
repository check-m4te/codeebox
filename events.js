// ! Imports
import {$js, update, updateURLCode, $html, $css} from './main'
import downloadZip from './download'
import previewer from './previewer'
import {$} from './main';
import cssFormatMonaco from 'css-format-monaco';
import * as monaco from 'monaco-editor'

// ! Variables
const $skypackBar  = $('.skypackbar')
const $skypackBtn  = $('#importmodule')
const $runBtn      = $('#run');
const $skypackInp  = $('#skyinp')
const $downloadBtn = $("#download");
const $jsBtn       = $('#skypack');
const $previewBtn  = $('#preview');

// * Open settings button
let open = false
$jsBtn.addEventListener('click', () => {
    if(!open){
        $skypackBar.style.display = "block";
        $jsBtn.style.borderLeft = `5px solid #0af`;
    }
    else{
        $skypackBar.style.display = "none";
        $jsBtn.style.borderLeft = `none`;
    }
    open = !open
})

// ! Event listeners
$skypackBtn.addEventListener('click', () => {
    $js.trigger('keyboard', 'type', {text: `import ${$skypackInp.value.replace('-', '').toLowerCase()} from 'https://cdn.skypack.dev/${$skypackInp.value}'`});
})

$downloadBtn.addEventListener("click", () => {
    downloadZip();
    let oldColor = $downloadBtn.style.color;
    $downloadBtn.style.color = 'lightgreen';
    setTimeout((() => $downloadBtn.style.color = oldColor), 5000)
})

$previewBtn.addEventListener('click', () => {
    previewer.openWindow();
})

$runBtn.addEventListener('click', () => {
    update();
})

var save = [$js,$html,$css].forEach(e => {
    e.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function() {
        update();
        updateURLCode($html.getValue(), $css.getValue(), $js.getValue());
    })    
})
var htmlPalette = $html.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP, function() {
    $html.trigger('anyString', 'editor.action.quickCommand')
});
var cssPalette = $css.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP, function() {
    $css.trigger('anyString', 'editor.action.quickCommand')
});
var jsPalette = $js.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP, function() {
    $js.trigger('anyString', 'editor.action.quickCommand')
});

const generateCssFormater = () => cssFormatMonaco(
    monaco,
    {
        indent_size: 2
    }
)

generateCssFormater();