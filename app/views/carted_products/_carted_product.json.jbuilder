json.id carted_product.id
json.cart_id carted_product.cart_id
json.product_id carted_product.product_id
json.amount carted_product.amount
json.created_at carted_product.friendly_created_at
json.updated_at carted_product.friendly_updated_at

json.product do
  json.partial! carted_product.product, partial: 'product', as: :product
end