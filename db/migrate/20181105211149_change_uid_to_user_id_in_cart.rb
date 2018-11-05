class ChangeUidToUserIdInCart < ActiveRecord::Migration[5.2]
  def change
    rename_column :carts, :uid, :user_id
  end
end
