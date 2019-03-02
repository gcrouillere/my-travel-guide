class AudienceSelection < ApplicationRecord
  has_many :article_audience_selections
  has_many :articles, through: :article_audience_selections
end
