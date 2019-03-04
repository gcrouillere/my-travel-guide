class Map < ApplicationRecord
  belongs_to :article
  has_many :markers
end
