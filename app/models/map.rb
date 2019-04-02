class Map < ApplicationRecord
  belongs_to :article
  has_many :markers, dependent: :destroy
  has_many :polylines, dependent: :destroy

  def class_name
    self.class.name
  end
end
