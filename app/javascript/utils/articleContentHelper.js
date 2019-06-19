export default {

   orderArticleElements(data) {
    if (!data.maps) data.maps = []
    if (!data.text_contents) data.text_contents = []
    if (!data.photos) data.photos = []

    return data.text_contents.concat(data.maps).concat(data.photos).sort((x, y) => x.position - y.position)
  }
}
