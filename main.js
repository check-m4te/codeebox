import './style.css';
import {
  encode,
  decode,
} from 'js-base64';

import split from 'split.js';
// !MONACO
import * as monaco from 'monaco-editor';
import {emmetHTML, emmetCSS} from 'emmet-monaco-es';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JSONWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CSSWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HTMLWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import TSWorker from
  'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new JSONWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new CSSWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new HTMLWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new TSWorker();
    }
    return new EditorWorker();
  },
};

const PARAMS = new URLSearchParams(window.location.search);
const options = {
  automaticLayout: true,
  fontLigatures: true,
  fontFamily: 'CascadiaCodePL',
  minimap: {
    enabled: false,
  },
  renderLineHighlight: 'line',
  renderLineHighlightOnlyWhenFocus: false,
  cursorSmoothCaretAnimation: true,
  cursorBlinking: 'smooth',

  padding: {
    top: 15,
  },
};

import {
  realtimeUpdate, urlsave,
} from './settings';

// . $ funtion (one-line-jquery 😉)
// TODO: INSTALL SpiralQuery
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// . Split JS (resizing)
const sp1 = split(['#a', '#b'], {
  gutterSize: 10,
  minSize: 0,
  onDragEnd: () => {
    localStorage.setItem('sizes', JSON.stringify({
      sp1: sp1.getSizes(),
      sp2: sp2.getSizes(),
      sp3: sp3.getSizes(),
    }));
  },
  cursor: 'col-resize',
});

const sp2 = split(['#c', '#d'], {
  direction: 'vertical',
  sizes: [50, 50],
  minSize: 0,
  onDragEnd: () => {
    localStorage.setItem('sizes', JSON.stringify({
      sp1: sp1.getSizes(),
      sp2: sp2.getSizes(),
      sp3: sp3.getSizes(),
    }));
  },
  gutterSize: 10,
  cursor: 'row-resize',
});

const sp3 = split(['#e', '#f'], {
  direction: 'vertical',
  sizes: [50, 50],
  gutterSize: 8,
  minSize: 0,
  onDragEnd: () => {
    localStorage.setItem('sizes', JSON.stringify({
      sp1: sp1.getSizes(),
      sp2: sp2.getSizes(),
      sp3: sp3.getSizes(),
    }));
  },
  cursor: 'row-resize',
});


// ! Create editors!
const $js = monaco.editor.create($('#js'), {
  ...options,
  language: 'javascript',
});
const $css = monaco.editor.create($('#css'), {
  ...options,
  language: 'css',
});
const $html = monaco.editor.create($('#html'), {
  ...options,
  language: 'html',
});

// * Set sizes:
const splitSizes = JSON.parse(localStorage.getItem('sizes')) ?? {
  sp1: sp1.getSizes(),
  sp2: sp2.getSizes(),
  sp3: sp3.getSizes(),
};
sp1.setSizes(splitSizes.sp1);
sp2.setSizes(splitSizes.sp2);
sp3.setSizes(splitSizes.sp3);

// * Editor configurations.

// .Events
$html.onDidChangeModelContent(() => {
  if (realtimeUpdate) {
    update();
  };
});
$css.onDidChangeModelContent(() => {
  if (realtimeUpdate) {
    update();
  };
});
$js.onDidChangeModelContent(() => {
  if (realtimeUpdate) {
    update();
  };
});

// ! URL
function updateURLCode(html, css, js) {
  if (urlsave) {
    const url = new URL(window.location);
    const codeBase64 = `${encode(html)}|_|${encode(css)}|_|${encode(js)}`;
    url.searchParams.set('code', codeBase64);
    window.history.replaceState('', 'CodeeBox', url);
  }
}
function getURLCode() {
  const codeBase64 = PARAMS.get('code');
  let code; let html; let js; let css = '';
  if (codeBase64) {
    code = codeBase64.split('|_|');
    html = decode(code[0]);
    css = decode(code[1]);
    js = decode(code[2]);
  } else {
    html = localStorage.getItem('html');
    css = localStorage.getItem('css');
    js = localStorage.getItem('js');
  }
  $html.setValue(html);
  $js.setValue(js);
  $css.setValue(css);
}
getURLCode();
// .First update, automatic.
update();

emmetCSS(monaco);
emmetHTML(monaco);

// ! UPDATE FUNCTION
function update() {
  if (!location.href.includes('localhost')) {
    console.clear();
  }
  let newJS = `
    <script>
      ${$js.getValue()}
    </script>
  `;
  if ($js.getValue().includes('import')) {
    newJS = `
    <script type="module">
      ${$js.getValue()}
    </script>
    `;
  }
  const htmlcomplete = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Webpage.</title>
    </head>
    <body>
      ${$html.getValue()}
      ${newJS}
      <style>
        ${$css.getValue()}
      </style>
    </body>

  </html>
`;
  $('iframe').setAttribute('srcdoc', htmlcomplete);
  localStorage.setItem('html', $html.getValue());
  localStorage.setItem('css', $css.getValue());
  localStorage.setItem('js', $js.getValue());
  if ($('#autosave').checked) {
    updateURLCode($html.getValue(), $css.getValue(), $js.getValue());
  }
}

// ! EXPORTS
export {
  $js,
  $html,
  $css,
  $,
  $$,
  update,
  updateURLCode,
};
