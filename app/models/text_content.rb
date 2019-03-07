class TextContent < ApplicationRecord
  belongs_to :article

  def class_name
    self.class.name
  end
end
