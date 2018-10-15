class Cart < ApplicationRecord
  validates :uid, uniqueness: true
  validates :uid, presence: true

  has_many :carted_products
  has_many :products, through: :carted_products

  def friendly_created_at
    created_at.strftime("%e %b %Y %H:%M:%S%p")
  end

  def friendly_updated_at
    updated_at.strftime("%e %b %Y %H:%M:%S%p")
  end
end
