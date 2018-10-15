class CartedProduct < ApplicationRecord
  validates :product_id, uniqueness: true

  belongs_to :cart
  belongs_to :product
end