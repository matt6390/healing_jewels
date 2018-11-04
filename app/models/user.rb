class User < ApplicationRecord
  has_secure_password
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :email, format: { with: /@/, message: "Must be a valid email address"}
end
