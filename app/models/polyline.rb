class Polyline < ApplicationRecord
  has_many :markers, dependent: :destroy
  belongs_to :map
end
