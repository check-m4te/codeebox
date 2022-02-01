// ! imports
import JSZip from 'jszip';
import {$js, $css, $html} from './main';
import {saveAs} from 'file-saver';

// ! Make the zip
const zip = new JSZip();

// * Generate the zip.
const generateZip = () => {
  const htmlFile = `
<!DOCTYPE html>
<html>
    <head>
        <link href="style.css" rel="stylesheet">
    </head>
    <body>
    ${$html.getValue()}
    <script type="module" src="script.js"></script>
    </body>
</html>
`;
  zip.file('style.css', $css.getValue());
  zip.file('index.html', htmlFile);
  zip.file('script.js', $js.getValue());
};

// ! Download the zip.
function exportFile() {
  generateZip();
  zip.generateAsync({type: 'blob'}).then(function(content) {
    // Download the Zip file.
    saveAs(content, 'codeebox.zip');
  });
}

function download() {
  const codeeformat = `###>><</CODEEBOX_SEPARATOR
${$html.getValue()}
###>><</CODEEBOX_SEPARATOR
${$css.getValue()}
###>><</CODEEBOX_SEPARATOR
${$js.getValue()}
  `;
  const a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,' +
      encodeURIComponent(codeeformat));
  a.setAttribute('download', 'project.codee');

  a.style.display = 'none';
  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);
}


export {download, exportFile};
