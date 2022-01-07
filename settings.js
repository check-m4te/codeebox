import {$} from './main'
import * as monaco from 'monaco-editor'

const $settingsBtn = $('#settings')
const $sidebar = $('.sidesidebar')
const $themeInput = $('#themeinp')
let open = false;

$settingsBtn.addEventListener("click", () => {
    if(!open)
        $sidebar.style.display = "block";
    else
        $sidebar.style.display = "none";
    open = !open
})

$themeInput.addEventListener('change', () => {
    var text = $themeInput.options[$themeInput.selectedIndex].text;
    fetch(`./themes/${text}.json`,{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
      })
        .then(data => data.json())
        .then(data => {
        monaco.editor.defineTheme('monokai', data);
        monaco.editor.setTheme('monokai');})
})
