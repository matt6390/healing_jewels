json.id user.id
json.name user.name
json.password_digest user.password_digest
json.created_at user.friendly_created_at
json.updated_at user.friendly_updated_at

json.cart do
  json.partial! user.cart, partial: 'cart', as: :cart
end