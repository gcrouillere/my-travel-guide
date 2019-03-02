require 'test_helper'

class ArticleTest < ActiveSupport::TestCase

  test "should save article without title" do
    article = Article.new
    assert article.save
  end
end
