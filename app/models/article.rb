class Article < ApplicationRecord
  has_many :text_contents, dependent: :destroy
  has_many :maps, dependent: :destroy
  has_many :article_audience_selections
  has_many :audience_selections, through: :article_audience_selections
end
