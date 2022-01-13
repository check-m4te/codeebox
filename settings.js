import { $html, $css, $js } from "./main";
import ace from 'ace-builds'
// * THEME IMPORT (Super unefficient)
// TODO: find a better system.
import pSBC from 'shade-blend-color';
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/theme-textmate'
import 'ace-builds/src-noconflict/theme-chaos'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/theme-cobalt'
import 'ace-builds/src-noconflict/theme-clouds'
import 'ace-builds/src-noconflict/theme-clouds_midnight'
import 'ace-builds/src-noconflict/theme-crimson_editor'
import 'ace-builds/src-noconflict/theme-dawn'
import 'ace-builds/src-noconflict/theme-dracula'
import 'ace-builds/src-noconflict/theme-dreamweaver'
import 'ace-builds/src-noconflict/theme-eclipse'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/theme-gob'
import 'ace-builds/src-noconflict/theme-gruvbox'
import 'ace-builds/src-noconflict/theme-idle_fingers'
import 'ace-builds/src-noconflict/theme-iplastic'
import 'ace-builds/src-noconflict/theme-katzenmilch'
import 'ace-builds/src-noconflict/theme-kr_theme'
import 'ace-builds/src-noconflict/theme-kuroir'
import 'ace-builds/src-noconflict/theme-merbivore'
import 'ace-builds/src-noconflict/theme-merbivore_soft'
import 'ace-builds/src-noconflict/theme-mono_industrial'
import 'ace-builds/src-noconflict/theme-one_dark'
import 'ace-builds/src-noconflict/theme-nord_dark'
import 'ace-builds/src-noconflict/theme-pastel_on_dark'
import 'ace-builds/src-noconflict/theme-solarized_dark'
import 'ace-builds/src-noconflict/theme-solarized_light'
import 'ace-builds/src-noconflict/theme-sqlserver'
import 'ace-builds/src-noconflict/theme-terminal'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/theme-tomorrow_night'
import 'ace-builds/src-noconflict/theme-tomorrow_night_blue'
import 'ace-builds/src-noconflict/theme-tomorrow_night_bright'
import 'ace-builds/src-noconflict/theme-tomorrow_night_eighties'
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/theme-vibrant_ink'
import 'ace-builds/src-noconflict/theme-xcode'

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

  function LightenDarkenColor(col,amt) {
    var usePound = false;
    if ( col[0] == "#" ) {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if ( r > 255 ) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if ( b > 255 ) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if ( g > 255 ) g = 255;
    else if  ( g < 0 ) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

const setFontSize = size => {
  size = parseInt(size)
  $html.setFontSize(size);
  $css.setFontSize(size);
  $js.setFontSize(size);
  localStorage.setItem('fontsize', size);
}

const setMonTheme = async p => {
  let text = `ace/theme/${p.replace(' ', '_').toLowerCase()}`
  $html.setTheme(text);
  $css.setTheme(text);
  $js.setTheme(text);
  let target_obj = document.getElementsByClassName('ace_scroller')[0];
  let color = getComputedStyle(target_obj).backgroundColor;
  let rgb = color.replace('(', "").replace(')', '').replace('rgb', '').split(',')
  let brightness = Math.round((
                      (parseInt(rgb[0])) +
                      (parseInt(rgb[1])) +
                      (parseInt(rgb[2]))) / 3);
  let accent = pSBC(0.06, color);
  let acento = pSBC(0.1, accent);
  console.log(accent)
  $('.sidebar').style.backgroundColor = accent;
  $('.horizontal-gutter').style.backgroundColor = accent;
  $('.vertical-gutter').style.backgroundColor = accent;
  $('.sidesidebar').style.backgroundColor = accent;
  $('input[type="number"]').style.backgroundColor = acento;
  $('.skypackbar').style.backgroundColor = accent;
  $$('select').forEach(item => {
    item.style.color = '#222';
  })
  $$('input').forEach(item => {
    item.style.color = '#222';
  })
  $$('option').forEach(item => {
    item.style.color = '#222';
  })
  if(brightness >= 125) {
    $$('g, path').forEach(svg => {
      svg.style.fill = 'black'
    })
    $$('label').forEach(e => {
      e.style.color = 'black'
    })
    $$('input[type="number"]').forEach(e =>{
      e.style.color = 'black'
    })
    $$('select').forEach(e =>{
      e.style.color = 'black'
      e.style.backgroundColor = 'white'
    })
    $$('option').forEach(e =>{
      e.style.color = 'black'
      e.style.backgroundColor = 'white'
    })
    acento = pSBC(-0.1, accent);
    $('input[type="number"]').style.backgroundColor = acento;
  }
  else {
    $$('g, path').forEach(svg => {
      svg.style.fill = 'white'
    })
    $$('label').forEach(e => {
      e.style.color = 'white'
    })
    $$('input[type="number"]').forEach(e =>{
      e.style.color = 'white'
    })
    acento = pSBC(0.1, accent);
    $$('select').forEach(e =>{
      e.style.color = 'white'
      e.style.backgroundColor = acento
    })
    $$('option').forEach(e =>{
      e.style.color = 'white'
      e.style.backgroundColor = acento
    })
  }
  
  localStorage.setItem('theme', p);
}

const setFont = text => {
  $html.setOption("fontFamily", text);
  $css.setOption("fontFamily", text);
  $js.setOption("fontFamily", text);
  localStorage.setItem('font', text);
}

const setLineNumbers = show => {
  $js.renderer.setShowGutter(show);
  $html.renderer.setShowGutter(show);
  $css.renderer.setShowGutter(show);
  localStorage.setItem('linenums', show);
}

const setWrap = wrap => {
  $html.getSession().setUseWrapMode(wrap);
  $js.getSession().setUseWrapMode(wrap);
  $css.getSession().setUseWrapMode(wrap);
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