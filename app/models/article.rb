class Article < ApplicationRecord
  has_many :text_contents, -> { order('position ASC') }, dependent: :destroy
  has_many :maps, -> { order('position ASC') }, dependent: :destroy
  has_many :photos, -> { order('position ASC') }, dependent: :destroy
  has_many :double_contents, -> { order('position ASC') }, dependent: :destroy
  has_many :article_audience_selections
  has_many :audience_selections, through: :article_audience_selections
  belongs_to :user

  include AlgoliaSearch

  algoliasearch auto_index: false, auto_remove: false do
    attribute :title
    add_attribute :article_id
  end

  def elements_position_mapping
    self.as_json(include: {
        text_contents: { methods: :class_name },
        maps: { methods: :class_name },
        photos: { methods: :class_name },
        double_contents: { methods: :class_name },
      }).select {|k, v| k.match(/^maps$|^text_contents$|^photos$|^double_contents$/)}
      .select {|k, v| v != []}
      .map {|k, v| v.map {|e| [e["class_name"], e["id"], e["position"]] }}
      .flatten(1)
  end

  def article_id
    self.id
  end
end
