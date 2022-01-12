// ! imports
import JSZip from "jszip";
import { $js, $css, $html } from "./main";
import { saveAs } from "file-saver";

// ! Make the zip
var zip = new JSZip();

// * Generate the zip.
const generateZip = () => {
  zip.file("style.css", $css.getValue());
  zip.file("index.html", htmlFile);
  zip.file("script.js", $js.getValue());
};

// * Generate the HTML file so it imports the other files.
let htmlFile = `
<!DOCTYPE html>
<html>
    <head>
        <link href="main.css" rel="stylesheet">
    </head>
    <body>
    ${$html.getValue()}
    <script type="module" src="script.js"></script>
    </body>
</html>
`;

// ! Download the zip.
function downloadZip() {
  generateZip();
  zip.generateAsync({ type: "blob" }).then(function (content) {
    // Download the Zip file.
    saveAs(content, "codeebox.zip");
  });
}

export default downloadZip;
