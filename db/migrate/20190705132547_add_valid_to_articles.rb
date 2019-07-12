class AddValidToArticles < ActiveRecord::Migration[5.2]
  def change
    add_column :articles, :article_valid, :boolean, default: false
  end
end
