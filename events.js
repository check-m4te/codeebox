import {$js} from './main'
import {downloadZip} from './download'
import previewer from './previewer'
const $ = sel => document.querySelector(sel)

const $skypackBar = $('.skypackbar')
const $skypackBtn = $('#importmodule')
const $skypackInp = $('#skyinp')

const $jsBtn = $('#skypack');
const $previewBtn = $('#preview');

let open = false
$jsBtn.addEventListener('click', () => {
    if(!open)
        $skypackBar.style.display = "block";
    else
        $skypackBar.style.display = "none";
    open = !open
})

$skypackBtn.addEventListener('click', () => {
    $js.setValue(`${$js.getValue()}\nimport module from 'https://cdn.skypack.dev/${$skypackInp.value}'`)
})

$("#download").addEventListener("click", () => {
    downloadZip();
})

$previewBtn.addEventListener('click', () => {
    previewer.openWindow();
})