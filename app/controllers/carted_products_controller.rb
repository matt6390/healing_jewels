class CartedProductsController < ApplicationController
  def index
    @carted_products = CartedProduct.find_by(cart_id: params[:cart_id])
    render json: @carted_products.as_json
  end
  def create
    @carted_product = CartedProduct.new(
                                         cart_id: params[:cart_id], 
                                         product_id: params[:product_id] 
                                        )
    if @carted_product.save 
     render json: @carted_product.as_json
    else
      render json: {errors: @carted_product.errors.full_messages}, status: :unprocessable_entity
    end
  end
  def delete 
    @product = CartedProduct.find(params[:id])
    @product.destroy
    render json: {message: 'Product succesfully removed'} 
  end
end
