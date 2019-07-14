class TextContent < ApplicationRecord
  belongs_to :article

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
    self.article.id
  end
end
