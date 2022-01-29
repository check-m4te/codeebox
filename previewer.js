export const preview = (html, css, js) => {
    const newWindow = window.open("");
    const stylesheet = newWindow.document.createElement('STYLE');
    stylesheet.innerHTML = `
        body {
            margin: 0;
            padding: 0;
            background: #fff;
        }
        iframe {
            width:100vw;
            height:100vh;
            margin: 0;
            padding: 0;
            border: none;
        }
    `;
    newWindow.document.head.appendChild(stylesheet)
    let newJS = `
    <script>
      ${js}
    </script>
  `;
    if ((js.includes('import \'') || js.includes('import \"') || js.includes('import \`')) && (js.includes('from') || js.includes('import('))) {
        newJS = `
        <script type="module">
        ${js}
        </script>
        `
    }
    newWindow.document.body.innerHTML = `
        <iframe></iframe>
    `
    newWindow.document.body.firstElementChild.srcdoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
        ${newJS}
      </body>
    </html>`
}