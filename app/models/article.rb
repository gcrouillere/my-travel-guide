class Article < ApplicationRecord
  has_many :text_contents, -> { order('position ASC') }, dependent: :destroy
  has_many :maps, -> { order('position ASC') }, dependent: :destroy
  has_many :photos, -> { order('position ASC') }, dependent: :destroy
  has_many :article_audience_selections
  has_many :audience_selections, through: :article_audience_selections

  def elements_position_mapping
    self.as_json(include: {
        text_contents: { methods: :class_name },
        maps: { methods: :class_name },
        photos: { methods: :class_name }
      }).select {|k, v| k.match(/^maps$|^text_contents$|^photos$/)}
      .select {|k, v| v != []}
      .map {|k, v| v.map {|e| [e["class_name"], e["id"], e["position"]] }}
      .flatten(1)
  end
end
