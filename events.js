import {$js} from './main'
const $ = sel => document.querySelector(sel)

const $jsBtn = $('#jsbtn');

$jsBtn.addEventListener('click', () => {
    $js.setValue($js.getValue() + `\nimport module from 'https://cdn.skypack.dev/package-name'`)
})