require "application_system_test_case"

class ArticlesTest < ApplicationSystemTestCase

  test "Test DB loading fixtures" do
    assert_equal 2, Article.count
  end

end
