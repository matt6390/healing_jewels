class AddAmountToCartedProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :carted_products, :amount, :integer
  end
end
