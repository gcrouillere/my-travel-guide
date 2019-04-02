class Marker < ApplicationRecord
  belongs_to :map, required: false
  belongs_to :polyline, required: false
end
