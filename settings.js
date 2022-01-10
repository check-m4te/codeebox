import { $html, $css, $js } from "./main";
import * as monaco from "monaco-editor";
const $ = sel => document.querySelector(sel)

// VARIABLES

const $settingsBtn = $("#settings");
const $sidebar = $(".sidesidebar");
const $themeInput = $("#themeinp");
const $fontInput = $("#fonts");
const $fontsizeInput = $("#fontsize");
const $realtime = $('#realtime');
let realtimeUpdate = true;
let open = false;

// FUNCTIONS {

const setFontSize = size => {
  let options = {
    "fontSize": size,
  };
  $html.updateOptions(options);
  $css.updateOptions(options);
  $js.updateOptions(options);
  localStorage.setItem('fontsize', size);
}

const setMonTheme = text => {
  fetch(
    "themes/" + text + ".json"
  )
    .then((data) => data.json())
    .then((data) => {
      monaco.editor.defineTheme("customtheme", data);
      monaco.editor.setTheme("customtheme");
    });
  localStorage.setItem('theme', text);
}

const setFont = text => {
  let options = {
    fontFamily: text,
  };
  $html.updateOptions(options);
  $css.updateOptions(options);
  $js.updateOptions(options);
  localStorage.setItem('font', text);
}

//}

// LOCAL STORAGE
if (!(localStorage.getItem('fontsize') && localStorage.getItem('theme') && localStorage.getItem('font'))) {
  localStorage.setItem('fontsize', 16);
  localStorage.setItem('theme', 'Monokai');
  localStorage.setItem('font', 'CascadiaCodePL');
}

window.addEventListener('DOMContentLoaded', () => {
  setFontSize(localStorage.getItem('fontsize'));
  setMonTheme(localStorage.getItem('theme'));
  setFont(localStorage.getItem('font'));
  $fontInput.selectedIndex = [...$fontInput.options].findIndex (option => option.text === localStorage.getItem('font'));
  $themeInput.selectedIndex = [...$themeInput.options].findIndex (option => option.text === localStorage.getItem('theme'));
  $fontsizeInput.value = localStorage.getItem('fontsize').toString();
})

// EVENTS

$settingsBtn.addEventListener("click", () => {
  if (!open) $sidebar.style.display = "block";
  else $sidebar.style.display = "none";
  open = !open;
});

//themes

$themeInput.addEventListener("change", () => {
  let text = encodeURI($themeInput.options[$themeInput.selectedIndex].text);
  setMonTheme(text);
});

$fontInput.addEventListener("change", () => {
  let text = encodeURI($fontInput.options[$fontInput.selectedIndex].text);
  setFont(text);
});

$fontsizeInput.addEventListener("change", () => {
  let size = parseInt($fontsizeInput.value);
  setFontSize(size);
});

$realtime.addEventListener('change', () => {
  realtimeUpdate = $realtime.checked;
})

export {
  realtimeUpdate,
}