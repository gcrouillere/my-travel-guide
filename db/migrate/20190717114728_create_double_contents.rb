class CreateDoubleContents < ActiveRecord::Migration[5.2]
  def change
    create_table :double_contents do |t|
      t.integer :position
      t.integer :height, default: 300
      t.references :article, foreign_key: true

      t.timestamps
    end
  end
end
