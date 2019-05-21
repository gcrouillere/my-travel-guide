require 'test_helper'

class PhotoTest < ActiveSupport::TestCase
  test 'should not save without article referenced' do
    photo = Photo.new
    assert_not photo.save
  end

  test 'should save with article referenced' do
    photo = Photo.new(article: Article.new())
    assert photo.save
  end

  test 'should return appropriate class' do
    photo = Photo.new(article: Article.new())
    assert photo.class_name == "Photo"
  end
end
