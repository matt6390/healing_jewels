class AddUidToCart < ActiveRecord::Migration[5.2]
  def change
    add_column :carts, :uid, :string
  end
end
