class CreateMarkers < ActiveRecord::Migration[5.2]
  def change
    create_table :markers do |t|
      t.float :lat
      t.float :lng
      t.references :map, foreign_key: true

      t.timestamps
    end
  end
end
