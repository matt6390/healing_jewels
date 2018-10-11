class RemoveUserCartsFromDatabase < ActiveRecord::Migration[5.2]
  def change
    drop_table :user_carts
  end
end
