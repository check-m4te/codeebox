// ! Imports the one-line jQuery
import { $ } from './main'


// * Create class
class Previewer {
  constructor () {
    this.previewerWindow = null
    this.iframeStyles = {
      background: '#fff',
      border: '0',
      height: '100%',
      width: '100%'
    }
  }

  // * Setup the IFrame
  setupWindowIframe () {
    const title = `${document.title} | Preview`
    this.previewerWindow.document.title = title
    this.previewerWindow.document.body.style.margin = 0
    this.iframe = this.previewerWindow.document.createElement('iframe')
    Object.entries(this.iframeStyles).forEach(
      ([attr, val]) => (this.iframe.style[attr] = val)
    )
    this.previewerWindow.document.body.appendChild(this.iframe)
  }


  // * Update content
  updateWindowContent (html) {
    if (this.previewerWindow) {
      this.iframe.setAttribute(
        'srcdoc',
        html || $('iframe').getAttribute('srcdoc')
      )
    }
  }


  // ! OPEN THE WINDOW
  openWindow () {
    this.previewerWindow = window.open()
    this.previewerWindow.addEventListener('beforeunload', () => (this.previewerWindow = null))
    this.setupWindowIframe()
    this.updateWindowContent()
  }
}

const previewer = new Previewer()

// - exports it.
export default previewer
