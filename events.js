// ! Imports
import {$js, update} from './main'
import downloadZip from './download'
import previewer from './previewer'
import {$} from './main'

// ! Variables
const $skypackBar = $('.skypackbar')
const $skypackBtn = $('#importmodule')
const $runBtn = $('#run');
const $skypackInp = $('#skyinp')

const $jsBtn = $('#skypack');
const $previewBtn = $('#preview');

// * Open settings button
let open = false
$jsBtn.addEventListener('click', () => {
    if(!open)
        $skypackBar.style.display = "block";
    else
        $skypackBar.style.display = "none";
    open = !open
})


// ! Event listeners
$skypackBtn.addEventListener('click', () => {
    $js.insert(`\nimport ${$skypackInp.value.replace('-', '').toLowerCase()} from 'https://cdn.skypack.dev/${$skypackInp.value}'`)
})

$("#download").addEventListener("click", () => {
    downloadZip();
})

$previewBtn.addEventListener('click', () => {
    previewer.openWindow();
})

$runBtn.addEventListener('click', () => {
    update();
})

