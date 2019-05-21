require 'test_helper'

class PolylineTest < ActiveSupport::TestCase

  test 'should not save without map referenced' do
    polyline = Polyline.new
    assert_not polyline.save
  end

  test 'should save with map referenced' do
    polyline = Polyline.new(map: Map.new())
    assert polyline.save
  end

  test 'should destroy dependent markers' do
    polyline = Polyline.create(map: Map.new())
    marker = Marker.create(polyline: polyline)
    assert Marker.where(id: marker.id) != []

    polyline.destroy
    assert Marker.where(id: marker.id) == []
  end

end
