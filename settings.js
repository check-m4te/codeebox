import { $html, $css, $js } from "./main";
import ace from 'ace-builds'
// * THEME IMPORT (Super unefficient)
import pSBC from 'shade-blend-color';
import * as monaco from 'monaco-editor'

// * VARIABLES

const $ = sel => document.querySelector(sel)
const $$ = sel => document.querySelectorAll(sel)

const $settingsBtn = $("#settings");
const $sidebar = $(".sidesidebar");
const $themeInput = $("#themeinp");
const $fontInput = $("#fonts");
const $fontsizeInput = $("#fontsize");
const $realtime = $('#realtime');
const $linenums = $('#linenums');
const $wrap = $('#wrapenabled');
let realtimeUpdate = true;
let open = false;

// * FUNCTIONS {

const setFontSize = size => {
  let options = {"fontSize": parseInt(size)}
  $html.updateOptions(options);
  $css.updateOptions(options);
  $js.updateOptions(options);
  localStorage.setItem('fontsize', size);
}

const setMonTheme = async p => {
  let accent, color, highlight, r, g, b, brightness;
  fetch(`/themes/${p}.json`)
  .then(data => data.json())
  .then(data => {
    monaco.editor.defineTheme('theme', data);
    monaco.editor.setTheme('theme');
    accent = pSBC(0.1, getComputedStyle($('.monaco-editor')).backgroundColor);
    color = getComputedStyle($('.monaco-editor')).backgroundColor;
    $('.sidebar').style.backgroundColor = accent;
    $('.sidesidebar').style.backgroundColor = accent;
    $('.skypackbar').style.backgroundColor = accent;
    highlight = color.replace('rgb(', '').replace(')','').split(',');
    r = parseInt(highlight[0]);
    g = parseInt(highlight[1]);
    b = parseInt(highlight[2]);
    brightness = ((r + g + b) / 3);
    if(brightness > 125) {
      $$('g, path').forEach(e => {
        e.style.fill = '#222';
      })
      $$('label, select, option').forEach(e => {
        e.style.color = '#222'
      })
      $$('select, option').forEach(e => {
        e.style.backgroundColor = '#dedede'
      })
      $$('input[type="number"]').forEach(e => {
        e.style.backgroundColor = pSBC(-0.1,accent)
        e.style.color = '#222'
      })
    }
    else{
      $$('g, path').forEach(e => {
        e.style.fill = '#dedede';
      })
      $$('label, select, option').forEach(e => {
        e.style.color = '#dedede'
      })
      $$('select, option').forEach(e => {
        e.style.backgroundColor = '#222'
        e.style.color = '#dedede'
      })

      $$('input[type="number"]').forEach(e => {
        e.style.backgroundColor = pSBC(0.1,accent)
        e.style.color = '#dedede'
      })
    }
  })
  
  
  
  localStorage.setItem('theme', p);
}

const setFont = text => {
  let options = {"fontFamily": text}
  $html.updateOptions(options);
  $css.updateOptions(options);
  $js.updateOptions(options);
  localStorage.setItem('font', text);
}

const setLineNumbers = show => {
  let options = {
    lineNumbers: show === true ? 'on' : 'off',
  }
  $js.updateOptions(options)
  $html.updateOptions(options)
  $css.updateOptions(options)
  localStorage.setItem('linenums', show);
}

const setWrap = wrap => {
  let options = {
    wordWrap: wrap === true ? "on" : "false",
    wrappingIndent: 'indent'
  }
  $js.updateOptions(options)
  $css.updateOptions(options)
  $html.updateOptions(options)
  localStorage.setItem('wrapenabled', wrap)
}

//* }

// * LOCAL STORAGE
if (!(localStorage.getItem('fontsize') && localStorage.getItem('theme') && localStorage.getItem('font'))) {
  localStorage.setItem('fontsize', 16);
  localStorage.setItem('theme', 'Monokai');
  localStorage.setItem('font', 'CascadiaCodePL');
}

window.onload = () => {
  // ! Call settings functions from localStorage
  setFontSize(localStorage.getItem('fontsize'));
  setFont(localStorage.getItem('font'));
  setMonTheme(localStorage.getItem('theme'));
  setLineNumbers(JSON.parse(localStorage.getItem('linenums')))
  setWrap(JSON.parse(localStorage.getItem('wrapenabled')))
  
  // . Set inputs and selects default value
  $fontInput.selectedIndex = [...$fontInput.options].findIndex (option => option.text === localStorage.getItem('font'));
  $themeInput.selectedIndex = [...$themeInput.options].findIndex (option => option.text === localStorage.getItem('theme'));
  $fontsizeInput.value = localStorage.getItem('fontsize').toString();
  $linenums.checked = JSON.parse(localStorage.getItem('linenums'));
  $wrap.checked = JSON.parse(localStorage.getItem('wrapenabled'));
}

// * EVENTS

$wrap.addEventListener('change', () => {
  let wrapEnable = $wrap.checked
  setWrap(wrapEnable)
})

$settingsBtn.addEventListener("click", () => {
  if (!open) $sidebar.style.display = "inline-block";
  else $sidebar.style.display = "none";
  open = !open;
});

// ! Themes

$themeInput.addEventListener("change", () => {
  let p = encodeURI($themeInput.options[$themeInput.selectedIndex].text);
  setMonTheme(p);
});

// ! Fonts

$fontInput.addEventListener("change", () => {
  let text = encodeURI($fontInput.options[$fontInput.selectedIndex].text);
  setFont(text);
});

// ! Font size

$fontsizeInput.addEventListener("change", () => {
  let size = parseInt($fontsizeInput.value);
  setFontSize(size);
});

// ! Realtime Update

$realtime.addEventListener('change', () => {
  realtimeUpdate = $realtime.checked;
})

// ! Show line numbers

$linenums.addEventListener('change', () => {
  setLineNumbers($linenums.checked)
})

export {
  realtimeUpdate,
  setMonTheme,
  setLineNumbers,
}