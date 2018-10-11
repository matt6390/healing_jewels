class Url < ApplicationRecord
  validates :link, presence: true
end
