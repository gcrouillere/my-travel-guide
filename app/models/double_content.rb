class DoubleContent < ApplicationRecord
  belongs_to :article
  has_many :text_contents, dependent: :destroy
  has_many :photos, dependent: :destroy
  has_many :maps, dependent: :destroy

  def associated_instances_mapping
    self.as_json(include: {
        text_contents: { methods: :class_name },
        maps: { methods: :class_name },
        photos: { methods: :class_name }
      })
      .select {|k, v| k.match(/^maps$|^text_contents$|^photos$/)}
      .select {|k, v| v != []}
      .map {|k, v| v.map {|e| [e["class_name"], e["id"], e["position"]] }}
      .sort {|a, b| a[2] <=> b[2]}
      .flatten(1)
  end

  def class_name
    self.class.name
  end
end
