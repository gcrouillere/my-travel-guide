class Photo < ApplicationRecord
  belongs_to :article, required: false
  belongs_to :double_content, required: false

  def class_name
    self.class.name
  end
end
