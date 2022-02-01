// ! Imports
import {$js, update, updateURLCode, $html, $css} from './main';
import {download, exportFile} from './download';
import {$} from './main';
import cssFormatMonaco from 'css-format-monaco';
import * as monaco from 'monaco-editor';
import {preview} from './previewer';
import {lightTheme} from './settings';

// ! Variables
const $skypackBar = $('.skypackbar');
const $skypackBtn = $('#importmodule');
const $runBtn = $('#run');
const $skypackInp = $('#skyinp');
const $downloadBtn = $('#download');
const $exportBtn = $('#export');
const $jsBtn = $('#skypack');
const $previewBtn = $('#preview');
const $importBtn = $('#import');


function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = (e) => {
    // you can use this method to get file and perform respective operations
    const files = e.target.files;
    const f = files[0];
    let r= '';
    console.log(f);
    const reader = new FileReader();
    reader.readAsText(f);
    reader.onload = function(f) {
      r = f.target.result.split('###>><</CODEEBOX_SEPARATOR');
      $html.setValue(r[1]);
      $css.setValue(r[2]);
      $js.setValue(r[3]);
    };
  };
  input.click();
}


// * Open settings button
let sopen = false;
$jsBtn.addEventListener('click', () => {
  if (!sopen) {
    $skypackBar.style.display = 'block';
    console.log(lightTheme);
    $jsBtn.style.borderLeft = `3px solid ${lightTheme ? '#222' : '#ccc'}`;
  } else {
    $skypackBar.style.display = 'none';
    $jsBtn.style.borderLeft = `3px solid transparent`;
  }
  sopen = !sopen;
});

// ! Event listeners
$skypackBtn.addEventListener('click', () => {
  $js.trigger('keyboard', 'type',
      {text: `import ${$skypackInp.value.replace('-', '').toLowerCase()} from 'https://cdn.skypack.dev/${$skypackInp.value}'`});
});

$downloadBtn.addEventListener('click', () => {
  download();
  const oldColor = $downloadBtn.style.color;
  $downloadBtn.style.color = 'lightgreen';
  setTimeout((() => $downloadBtn.style.color = oldColor), 5000);
});

$exportBtn.addEventListener('click', () => {
  exportFile();
  const oldColor = $exportBtn.style.color;
  $downloadBtn.style.color = 'lightgreen';
  setTimeout((() => $exportBtn.style.color = oldColor), 5000);
});

$previewBtn.addEventListener('click', () => {
  preview($html.getValue(), $css.getValue(), $js.getValue());
});

$runBtn.addEventListener('click', () => {
  update();
});

$importBtn.addEventListener('click', () => {
  importData();
});


[$js, $html, $css].forEach((e) => {
  e.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function() {
    update();
    updateURLCode($html.getValue(), $css.getValue(), $js.getValue());
  });
  e.addCommand(monaco.KeyMod.CtrlCmd |
    monaco.KeyMod.Shift |
    monaco.KeyCode.KeyP, () => {
    $html.trigger('anyString', 'editor.action.quickCommand');
  });
});

const generateCssFormater = () => cssFormatMonaco(
    monaco,
    {
      indent_size: 2,
    },
);

generateCssFormater();
