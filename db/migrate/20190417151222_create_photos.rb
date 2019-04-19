class CreatePhotos < ActiveRecord::Migration[5.2]
  def change
    create_table :photos do |t|
      t.integer :position
      t.string :public_id
      t.string :version
      t.string :signature
      t.integer :width
      t.integer :height
      t.string :format
      t.string :resource_type
      t.string :url
      t.string :original_filename
      t.references :article, foreign_key: true

      t.timestamps
    end
  end
end
