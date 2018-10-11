class AddDownloadUrlToProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :download_url, :string
  end
end
