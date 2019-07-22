class Photo < ApplicationRecord
  belongs_to :article, required: false
  belongs_to :double_content, required: false
  before_destroy :remove_from_cloudinary

  def class_name
    self.class.name
  end

  def remove_from_cloudinary
    Cloudinary::Api.delete_resources([self.public_id])
  end
end
