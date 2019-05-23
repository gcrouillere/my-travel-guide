require "application_system_test_case"

class ArticlesTest < ApplicationSystemTestCase

  test "test DB loading fixtures" do
    assert_equal 2, Article.count
  end

  test 'articles list displays accordingly' do
    visit articles_path

    assert_selector ".card-header a span", text: "Article one"
    assert_selector ".card-text", text: /Awesome content/

    assert_selector ".card-header a span", text: "Article two"
    assert_selector ".card-text", text: /Incredibly interesting/
  end

end
