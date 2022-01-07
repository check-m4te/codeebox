import {$} from './main'
import * as monaco from 'monaco-editor'

const $settingsBtn = $('#settings')
const $sidebar = $('.sidesidebar')
const $setThemeBtn = $('#settheme')
const $themeInput = $('#themeinp')
let open = false;

function capitalizeWords(string) {
    return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

$settingsBtn.addEventListener("click", () => {
    if(!open)
        $sidebar.style.display = "block";
    else
        $sidebar.style.display = "none";
    open = !open
})

$setThemeBtn.addEventListener('click', () => {
    let importable = './themes/' + capitalizeWords($themeInput.value) + '.json'
    import(importable)
    .then(data => {
        monaco.editor.defineTheme('customTheme', data);
        monaco.editor.setTheme('customTheme', data);
    })
})
