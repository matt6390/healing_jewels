class Product < ApplicationRecord
  validates :name, presence: true
  validates :description, presence: true
  validates :price, presence: true, numericality: true
  validates :download_url, presence: true

  has_many :carted_products
  has_many :carts, through: :carted_products
end
