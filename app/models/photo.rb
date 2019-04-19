class Photo < ApplicationRecord
  belongs_to :article

  def class_name
    self.class.name
  end
end
