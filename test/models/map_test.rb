require 'test_helper'

class MapTest < ActiveSupport::TestCase

  test 'should not save without article referenced' do
    map = Map.new
    assert_not map.save
  end

  test 'should save with article referenced' do
    map = Map.new(article: Article.new())
    assert map.save
  end

  test 'should return appropriate class' do
    map = Map.new(article: Article.new())
    assert map.class_name == "Map"
  end

  test 'should destroy associated maps markers and polylines' do
    article = Article.create()
    map = Map.create(article: article)
    polyline = Polyline.create(map: map)
    marker = Marker.create(map: map)
    assert Map.where(id: map.id) != []
    assert Polyline.where(id: polyline.id) != []
    assert Marker.where(id: marker.id) != []


    map.destroy
    assert Map.where(id: map.id) == []
    assert Polyline.where(id: polyline.id) == []
    assert Marker.where(id: marker.id) == []
    article.destroy
  end
end
