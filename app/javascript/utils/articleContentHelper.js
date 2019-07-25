export default {

   orderArticleElements(data) {
    if (!data.maps) data.maps = []
    if (!data.text_contents) data.text_contents = []
    if (!data.photos) data.photos = []
    if (!data.double_contents) data.double_contents = []

    return data.text_contents
      .concat(data.maps)
      .concat(data.photos)
      .concat(data.double_contents)
      .sort((x, y) => x.position - y.position)
  }
}
