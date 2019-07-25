class TextContent < ApplicationRecord
  belongs_to :article, required: false
  belongs_to :double_content, required: false

  include AlgoliaSearch

  algoliasearch auto_index: false, auto_remove: false do
    attribute :text
    add_attribute :text_sanitized
    add_attribute :article_id
  end

  def class_name
    self.class.name
  end

  def text_sanitized
    self.text.gsub(/<(?:.|\n)*?>/, '')
  end

  def article_id
    self.article ? self.article.id : self.double_content.article.id
  end
end
