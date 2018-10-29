class Product < ApplicationRecord
  validates :name, presence: true
  validates :description, presence: true
  validates :price, presence: true, numericality: true
  validates :download_url, presence: true

  has_many :carted_products
  has_many :carts, through: :carted_products
  
  enum category: [:necklace, :bracelet, :earring, :ring]

  def formatted_price
    sprintf("$%2.2f", price)
  end

  def friendly_created_at
    created_at.strftime("%e %b %Y %H:%M:%S%p")
  end

  def friendly_updated_at
    updated_at.strftime("%e %b %Y %H:%M:%S%p")
  end
end
