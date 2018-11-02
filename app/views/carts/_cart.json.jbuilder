json.id cart.id
json.uid cart.uid
json.created_at cart.created_at
json.updated_at cart.updated_at
json.total cart.total

# will display a carted_product, as well as the product information.
json.carted_products cart.ordered_carted_products do |carted_product|
  json.id carted_product.id
  json.cart_id carted_product.cart_id
  json.product_id carted_product.product_id
  json.amount carted_product.amount
  json.created_at carted_product.friendly_created_at
  json.updated_at carted_product.friendly_updated_at

  json.product do
    json.partial! carted_product.product, partial: 'product', as: :product
  end
end