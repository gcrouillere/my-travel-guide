class CreatePolylines < ActiveRecord::Migration[5.2]
  def change
    create_table :polylines do |t|
      t.boolean :distance_displayed
      t.references :map, foreign_key: true

      t.timestamps
    end
  end
end
