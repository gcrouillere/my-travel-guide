class CreateMaps < ActiveRecord::Migration[5.2]
  def change
    create_table :maps do |t|
      t.integer :zoom
      t.string :name
      t.float :lat
      t.float :lng
      t.references :article, foreign_key: true

      t.timestamps
    end
  end
end
