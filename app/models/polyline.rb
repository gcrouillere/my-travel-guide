class Polyline < ApplicationRecord
  has_many :markers, -> { order('position ASC') }, dependent: :destroy
  belongs_to :map
end
