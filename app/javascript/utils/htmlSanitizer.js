export default {

  sanitizeAndTruncateHTML(html, maxLength) {
    const etc = html.length > maxLength ? " ..." : ""
    return html.replace(/<(?:.|\n)*?>/gm, '').substr(0, maxLength) + etc
  }
}
