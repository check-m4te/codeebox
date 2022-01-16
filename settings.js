import { $html, $css, $js } from "./main";
// * THEME IMPORT (Super unefficient)
import pSBC from 'shade-blend-color';
import * as monaco from 'monaco-editor'

// * VARIABLES

// . Two lines jquery
const $ = sel => document.querySelector(sel)
const $$ = sel => document.querySelectorAll(sel)

//. IDS
const $settingsBtn   = $("#settings");
const $themeInput    = $("#themeinp");
const $fontInput     = $("#fonts");
const $fontsizeInput = $("#fontsize");
const $realtime      = $('#realtime');
const $linenums      = $('#linenums');
const $wrap          = $('#wrapenabled');
const $minimap       = $('#minimap');
//. CLASSES
const $sidebar       = $(".sidesidebar");
//. BOOLEANS
let realtimeUpdate   = true;
let open             = false;

// * FUNCTIONS {
//. Font size
const setFontSize = size => {
  let options = {"fontSize": parseInt(size)}
  $html.updateOptions(options);
  $css.updateOptions(options);
  $js.updateOptions(options);
  localStorage.setItem('fontsize', size);
}

//. Theme
const setMonTheme = async p => {
  let accent,color, highlight, r, g, b, brightness;
  fetch(`/themes/${p}.json`)
  .then(data => data.json())
  .then(data => {
    monaco.editor.defineTheme('theme', data);
    monaco.editor.setTheme('theme');
    accent = pSBC(0.1, getComputedStyle($('.monaco-editor')).backgroundColor);
    color = getComputedStyle($('.monaco-editor')).backgroundColor;
    highlight = color.replace('rgb(', '').replace(')','').split(',');
    r = parseInt(highlight[0]);
    g = parseInt(highlight[1]);
    b = parseInt(highlight[2]);
    brightness = ((r + g + b) / 3);
    if(brightness > 125) {
      accent = pSBC(-0.15, color)
      $$('label, select, option, a, .fa-brands, .fa-solid').forEach(e => {
        e.style.color = '#222'
      })
      $$('select, option').forEach(e => {
        e.style.backgroundColor = '#dedede'
      })
      $$('input[type="number"], input[type="checkbox"]').forEach(e => {
        e.style.backgroundColor = pSBC(-0.1, accent)
        e.style.color = '#222'
      })
    }
    else{
      $$('label, select, option, a, .fa-brands, .fa-solid').forEach(e => {
        e.style.color = '#dedede'
      })
      $$('select, option').forEach(e => {
        e.style.backgroundColor = pSBC(0.1,accent)
      })

      $$('input[type="number"], input[type="text"], input[type="checkbox"]').forEach(e => {
        e.style.backgroundColor = pSBC(0.1,accent)
        e.style.color = '#dedede'
      })
    }
    $('.sidebar').style.backgroundColor = accent;
    $('.sidesidebar').style.backgroundColor = accent;
    $('.skypackbar').style.backgroundColor = accent;
    $$('.gutter').forEach(e=> e.style.backgroundColor = accent);
  })
  
  localStorage.setItem('theme', p);
}

//. Font
const setFont = text => {
  let options = {"fontFamily": text}
  $html.updateOptions(options);
  $css.updateOptions(options);
  $js.updateOptions(options);
  localStorage.setItem('font', text);
}

//. Numbers
const setLineNumbers = show => {
  let options = {
    lineNumbers: show === true ? 'on' : 'off',
  }
  $js.updateOptions(options)
  $html.updateOptions(options)
  $css.updateOptions(options)
  localStorage.setItem('linenums', show);
}

//. Word Wrap
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

//. Word Wrap
const setMinimap = wrap => {
  let options = {
    minimap: {
      enabled: wrap,
    }
  }
  $js.updateOptions(options)
  $css.updateOptions(options)
  $html.updateOptions(options)
  localStorage.setItem('minimapenabled', wrap)
}

//* }

// * LOCAL STORAGE
if (!(localStorage.getItem('fontsize') && localStorage.getItem('theme') && localStorage.getItem('font'))) {
  localStorage.setItem('fontsize', 16);
  localStorage.setItem('theme', 'Monokai');
  localStorage.setItem('font', 'CascadiaCodePL');
  localStorage.setItem('minimapenabled', false);
  localStorage.setItem('wrapenabled', false);
}

window.onload = () => {
  // ! Call settings functions from localStorage
  setFontSize(localStorage.getItem('fontsize'));
  setFont(localStorage.getItem('font'));
  setMonTheme(localStorage.getItem('theme'));
  setLineNumbers(JSON.parse(localStorage.getItem('linenums')))
  setWrap(JSON.parse(localStorage.getItem('wrapenabled')))
  setMinimap(JSON.parse(localStorage.getItem('minimapenabled')));
  
  // . Set inputs and selects default value
  $fontInput.selectedIndex = [...$fontInput.options].findIndex (option => option.text === localStorage.getItem('font'));
  $themeInput.selectedIndex = [...$themeInput.options].findIndex (option => option.text === localStorage.getItem('theme'));
  $fontsizeInput.value = localStorage.getItem('fontsize').toString();
  $linenums.checked = JSON.parse(localStorage.getItem('linenums'));
  $wrap.checked = JSON.parse(localStorage.getItem('wrapenabled'));
  $minimap.checked = JSON.parse(localStorage.getItem('minimapenabled'));
}

// * EVENTS

$settingsBtn.addEventListener("click", () => {
  if (!open) {
    $sidebar.style.display = "inline-block";
    $settingsBtn.style.borderLeft = `5px solid #0af`
  }
  else {$sidebar.style.display = "none"
  $settingsBtn.style.borderLeft = `none`}
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

// ! Wrap
$wrap.addEventListener('change', () => {
  let wrapEnable = $wrap.checked
  setWrap(wrapEnable)
})

// ! Minimap
$minimap.addEventListener('change', () => {
  let minimap = $minimap.checked
  setMinimap(minimap)
})

export {
  realtimeUpdate,
  setMonTheme,
  setLineNumbers,
}