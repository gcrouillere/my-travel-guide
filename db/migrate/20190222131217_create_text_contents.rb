class CreateTextContents < ActiveRecord::Migration[5.2]
  def change
    create_table :text_contents do |t|
      t.text :text
      t.references :article, foreign_key: true

      t.timestamps
    end
  end
end
