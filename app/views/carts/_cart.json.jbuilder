json.id cart.id
json.uid cart.uid
json.created_at cart.created_at
json.updated_at cart.updated_at

# will display a carted_product, as well as the product information.
json.carted_products cart.carted_products do |carted_product|
  json.id carted_product.id
  json.cart_id carted_product.cart_id
  json.product_id carted_product.product_id
  json.created_at carted_product.created_at
  json.updated_at carted_product.updated_at

  json.product carted_product.product
end