require 'test_helper'

class TextContentTest < ActiveSupport::TestCase

  test "should not save text content without article referenced" do
    text_content = TextContent.new
    assert_not text_content.save
  end

  test "should save text content with article referenced and text empty" do
    text_content = TextContent.new(article: Article.create())
    assert text_content.save
  end
end
