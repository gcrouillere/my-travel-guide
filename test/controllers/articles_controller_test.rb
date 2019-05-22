require 'test_helper'

class ArticlesControllerTest < ActionDispatch::IntegrationTest

  test 'should get index url' do
    get articles_path
    assert_response :success
  end

  test 'should get article url' do
    article = articles(:one)
    get article_path(article)
    assert_response :success
  end

  test 'should get edit article url' do
    article = articles(:one)
    get edit_article_path(article)
    assert_response :success
  end

end
