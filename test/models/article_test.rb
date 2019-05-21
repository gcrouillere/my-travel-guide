require 'test_helper'

class ArticleTest < ActiveSupport::TestCase

  test "should save article without title" do
    article = Article.new
    assert article.save
  end

  test "destroy dependent associations when article is destroyed" do
    article = Article.create()
    map = Map.create(article: article)
    photo = Photo.create(article: article)
    text_content = TextContent.create(article: article)
    assert Map.where(id: map.id) != []
    assert Photo.where(id: photo.id) != []
    assert TextContent.where(id: text_content.id) != []

    article.destroy
    assert Map.where(id: map.id) == []
    assert Photo.where(id: photo.id) == []
    assert TextContent.where(id: text_content.id) == []
  end

  test 'returns correct element position mapping' do
    article = Article.create()
    map = Map.create(article: article, position: 0)
    photo = Photo.create(article: article, position: 1)
    text_content = TextContent.create(article: article, position: 2)

    mapped_array = article.elements_position_mapping
    expected_array = [ ["TextContent", text_content.id, 2], ["Map", map.id, 0], ["Photo", photo.id, 1] ]

    assert mapped_array == expected_array
    article.destroy
  end
end
