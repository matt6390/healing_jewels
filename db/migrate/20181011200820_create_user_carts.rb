class CreateUserCarts < ActiveRecord::Migration[5.2]
  def change
    create_table :user_carts do |t|
      t.integer :uid
      t.integer :cart_id

      t.timestamps
    end
  end
end
