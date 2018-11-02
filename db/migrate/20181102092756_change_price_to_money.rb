class ChangePriceToMoney < ActiveRecord::Migration[5.2]
  def change
    change_column :products, :price, :money
  end
end
