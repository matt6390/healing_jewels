class Cart < ApplicationRecord
  validates :uid, uniqueness: true
  validates :uid, presence: true

  has_many :carted_products
  has_many :products, through: :carted_products

  def total  
    x = carted_products
    total = 0
    x.each do |carted_product|
      quantity = carted_product.amount
      cost = carted_product.product.price
      all_together = cost * quantity

      total += all_together
    end
    sprintf("%2.2f", total)
  end

  def ordered_carted_products 
    carted_products.order('created_at' => :asc)
  end

  def friendly_created_at
    created_at.strftime("%e %b %Y %H:%M:%S%p")
  end

  def friendly_updated_at
    updated_at.strftime("%e %b %Y %H:%M:%S%p")
  end
end
