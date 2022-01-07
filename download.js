import JSZip from 'jszip'
import {$js, $css, $html} from './main'
import { saveAs } from 'file-saver';

var zip = new JSZip();

function downloadZip() {
    zip.file("style.css", $css.getValue());
    zip.file("index.html", $html.getValue());
    zip.file("script.js", $js.getValue());
    zip.generateAsync({type:"blob"}).then(function(content) {
        // see FileSaver.js
        saveAs(content, "codeebox.zip");
    });
}

export {downloadZip}