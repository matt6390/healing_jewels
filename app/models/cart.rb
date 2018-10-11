class Cart < ApplicationRecord
  validates :uid, uniqueness: true
  validates :uid, presence: true

  has_many :carted_products
  has_many :products, through: :carted_products
end
