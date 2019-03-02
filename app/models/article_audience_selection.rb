class ArticleAudienceSelection < ApplicationRecord
  belongs_to :article
  belongs_to :audience_selection
end
