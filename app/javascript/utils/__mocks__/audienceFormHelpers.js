import article from './../../../../test/javascript/__mocks__/fakeArticle.json'
import audienceSelection from './../../../../test/javascript/__mocks__/audienceSelection.json'
import updatedArticle from './../../../../test/javascript/__mocks__/fakeArticleFedWithText.json'

const getDataFromURL = jest.fn((url) => {

  if ( /^\/articles\/[0-9]+/.test(url) ) {
    return Promise.resolve(article)
  } else if (/^\/audience_selections/.test(url) ) {
    return Promise.resolve(audienceSelection)
  }

});

const updateDataInURL = jest.fn((url, data, token) => {
  if (data.article.audience_selection_ids && data.article.audience_selection_ids.length ==  2) {
    return Promise.resolve(updatedArticle)
  } else {
    return Promise.resolve(article)
  }
});

module.exports = {
  getDataFromURL,
  updateDataInURL
}
