import {$js} from './main'
import {downloadZip} from './download'
const $ = sel => document.querySelector(sel)

const $jsBtn = $('#skypack');

$jsBtn.addEventListener('click', () => {
    $js.setValue($js.getValue() + `\nimport module from 'https://cdn.skypack.dev/package-name'`)
})

$("#download").addEventListener("click", () => {
    downloadZip();
})

