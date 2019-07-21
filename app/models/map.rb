class Map < ApplicationRecord
  belongs_to :article, required: false
  belongs_to :double_content, required: false
  has_many :markers, dependent: :destroy
  has_many :polylines, dependent: :destroy

  def class_name
    self.class.name
  end
end
