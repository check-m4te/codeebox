import { $html, $css, $js } from "./main";
import ace from 'ace-builds'
// * THEME IMPORT (Super unefficient)
// TODO: find a better system.
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
let realtimeUpdate = true;
let open = false;

// * FUNCTIONS {

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
  console.log(color);
  let rgb = color.replace('(', "").replace(')', '').replace('rgb', '').split(',')
  let brightness = Math.round((
                      (parseInt(rgb[0])) +
                      (parseInt(rgb[1])) +
                      (parseInt(rgb[2]))) / 3);
  $('.sidebar').style.backgroundColor = color;
  $('.sidesidebar').style.backgroundColor = color;
  $('.skypackbar').style.backgroundColor = color;
  if(brightness > 125) {
    console.log('test')
    $$('g, path').forEach(svg => {
      svg.style.fill = 'black'
    })
    $$('label').forEach(svg => {
      svg.style.color = 'black'
    })
  }
  else {
    $$('g, path').forEach(svg => {
      svg.style.fill = 'white'
    })
    $$('label').forEach(svg => {
      svg.style.color = 'white'
    })
  }
  $$('select').forEach(item => {
    item.style.color = '#222';
  })
  $$('input').forEach(item => {
    item.style.color = '#222';
  })
  $$('option').forEach(item => {
    item.style.color = '#222';
  })
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

//* }

// * LOCAL STORAGE
if (!(localStorage.getItem('fontsize') && localStorage.getItem('theme') && localStorage.getItem('font'))) {
  localStorage.setItem('fontsize', 16);
  localStorage.setItem('theme', 'Monokai');
  localStorage.setItem('font', 'CascadiaCodePL');
}

window.onload = () => {
  setFontSize(localStorage.getItem('fontsize'));
  setFont(localStorage.getItem('font'));
  $fontInput.selectedIndex = [...$fontInput.options].findIndex (option => option.text === localStorage.getItem('font'));
  $themeInput.selectedIndex = [...$themeInput.options].findIndex (option => option.text === localStorage.getItem('theme'));
  $fontsizeInput.value = localStorage.getItem('fontsize').toString();
  $linenums.checked = JSON.parse(localStorage.getItem('linenums'));
  setMonTheme(localStorage.getItem('theme'));
  setLineNumbers(JSON.parse(localStorage.getItem('linenums')))

}

// * EVENTS

$settingsBtn.addEventListener("click", () => {
  if (!open) $sidebar.style.display = "block";
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