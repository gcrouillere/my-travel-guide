class AddReferencesToContents < ActiveRecord::Migration[5.2]
  def change
    add_reference :text_contents, :double_content, foreign_key: true
    add_reference :maps, :double_content, foreign_key: true
    add_reference :photos, :double_content, foreign_key: true
  end
end
