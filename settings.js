import { $html, $css, $js } from "./main";
import * as monaco from "monaco-editor";
const $ = sel => document.querySelector(sel)

const $settingsBtn = $("#settings");
const $sidebar = $(".sidesidebar");
const $themeInput = $("#themeinp");
const $fontInput = $("#fonts");
const $fontsizeInput = $("#fontsize");
const $realtime = $('#realtime');
let realtimeUpdate = true;
let open = false;

$settingsBtn.addEventListener("click", () => {
  if (!open) $sidebar.style.display = "block";
  else $sidebar.style.display = "none";
  open = !open;
});

//Themes
$themeInput.addEventListener("change", () => {
  var text = encodeURI($themeInput.options[$themeInput.selectedIndex].text);
  fetch(
    "https://raw.githubusercontent.com/L1ghtingBolt/codeebox/master/themes/" +
      text +
      ".json"
  )
    .then((data) => data.json())
    .then((data) => {
      monaco.editor.defineTheme("customtheme", data);
      monaco.editor.setTheme("customtheme");
    });
});

$fontInput.addEventListener("change", () => {
  var text = encodeURI($fontInput.options[$fontInput.selectedIndex].text);
  let options = {
    fontFamily: text,
  };
  if (text === "Fira Code") {
    $html.updateOptions({ fontFamily: "FiraCode" });
    $css.updateOptions({ fontFamily: "FiraCode" });
    $js.updateOptions({ fontFamily: "FiraCode" });
  } else {
    $html.updateOptions(options);
    $css.updateOptions(options);
    $js.updateOptions(options);
  }
});

$fontsizeInput.addEventListener("change", () => {
  let options = {
    "fontSize": parseInt($fontsizeInput.value),
  };
  $html.updateOptions(options);
  $css.updateOptions(options);
  $js.updateOptions(options);
});

$realtime.addEventListener('change', () => {
  realtimeUpdate = $realtime.checked;
})

export {
  realtimeUpdate,
}