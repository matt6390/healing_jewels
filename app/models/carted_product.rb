class CartedProduct < ApplicationRecord
  validates :product_id, uniqueness: true

  belongs_to :cart
  belongs_to :product

  def friendly_created_at
    created_at.strftime("%e %b %Y %H:%M:%S%p")
  end

  def friendly_updated_at
    updated_at.strftime("%e %b %Y %H:%M:%S%p")
  end
end