import {$} from './main'
import * as monaco from 'monaco-editor'

const $settingsBtn = $('#settings')
const $sidebar = $('.sidesidebar')
const $setThemeBtn = $('#settheme')
const $themeInput = $('#themeinp')
let open = false;


//capitalize all words of a string. 
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
    fetch(`/themes/${capitalizeWords($themeInput.value)}.json`)
        .then(data => data.json())
        .then(data => {
        monaco.editor.defineTheme('monokai', data);
        monaco.editor.setTheme('monokai');})
        .catch( err => {
                alert('Invalid theme!')
            })
})
