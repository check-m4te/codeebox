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
let editors;
//. OBJECTS
let options          = {
  fontSize: 18,
  fontFamily:'CascadiaCodePL',
  minimap: {
    enabled:false,
  },
  wordWrap: "on",
  lineNumbers: "off",
}
// * FUNCTIONS {

function ontotrue(on) {
  return on === 'on' ? true : false;
}

// !!! SETUP FUNCTION
const setup = () => {
  // ! Call settings functions from localStorage
  options = JSON.parse(localStorage.getItem('options'));
  setFontSize(options.fontSize);
  setFont(options.fontFamily);
  setMonTheme(localStorage.getItem('theme'));
  setLineNumbers(options.lineNumbers)
  setWrap(options.wordWrap)
  setMinimap(options.minimap.enabled);

  // . Set inputs and selects default value
  $fontInput.selectedIndex = [...$fontInput.options].findIndex (option => option.text === options.fontFamily);
  $themeInput.selectedIndex = [...$themeInput.options].findIndex (option => option.text === localStorage.getItem('theme'));
  $fontsizeInput.value = options.fontSize.toString();
  $linenums.checked = ontotrue(options.lineNumbers);
  $wrap.checked = ontotrue(options.wordWrap);
  $minimap.checked = options.minimap.enabled;
}

const updateSettings = () => {
  editors.forEach(e => {
    e.updateOptions(options);
  })
  localStorage.setItem('options', JSON.stringify(options));
}

//. Font size
const setFontSize = size => {
  options.fontSize = size;
  updateSettings();
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
  
  localStorage.setItem('theme', p.replace("%20", " "));
}

//. Font
const setFont = text => {
  options.fontFamily = text;
  updateSettings();
}

//. Numbers
const setLineNumbers = show => {
  options.lineNumbers = show;
  updateSettings();
}

//. Word Wrap
const setWrap = show => {
  options.wordWrap = show;
  updateSettings();
}

//. Word Wrap
const setMinimap = show => {
  options.minimap.enabled = show;
  updateSettings();
}

//* }

// * LOCAL STORAGE
if (!(localStorage.getItem('options') && localStorage.getItem('theme'))) {
  localStorage.setItem('options', JSON.stringify(options));
  localStorage.setItem('theme', 'Monokai');
}

window.onload = () => {
  editors = [$js,$html,$css];
  setup();
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