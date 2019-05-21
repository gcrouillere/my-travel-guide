require 'test_helper'

class MarkerTest < ActiveSupport::TestCase

  test 'should save without map or polyline referenced' do
    marker = Marker.new
    assert marker.save
  end

  test 'should save with map referenced' do
    marker = Marker.new(map: Map.new())
    assert marker.save
  end

  test 'should save with polyline referenced' do
    marker = Marker.new(polyline: Polyline.new(map: Map.new()))
    assert marker.save
  end
end
