class CreateAudienceSelections < ActiveRecord::Migration[5.2]
    def change
    create_table :audience_selections do |t|
      t.string :audience
      t.timestamps
    end

    create_table :article_audience_selections do |t|
      t.references :article, foreign_key: true
      t.references :audience_selection, foreign_key: true
      t.timestamps
    end
  end
end
