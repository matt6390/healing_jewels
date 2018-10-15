class CartedProductsController < ApplicationController
  def index
    @carted_products = CartedProduct.find_by(cart_id: params[:id])
    render json: @carted_products.as_json
  end

  def show
    @carted_product = CartedProduct.find()
  end

  def create
    @carted_product = CartedProduct.new(
                                         cart_id: params[:cart_id], 
                                         product_id: params[:product_id],
                                         amount: params[:amount]
                                        )
    if @carted_product.save 
     render json: @carted_product.as_json
    else
      render json: {errors: @carted_product.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def update
    #updates will happen when a Product is added or 1 of multiple items is removed from the cart
    #Like if you accidentally said 2, but really just want 1
    @carted_product = CartedProduct.find_by(cart_id: params[:cart_id], product_id: params[:product_id])

    @carted_product.cart_id = params[:cart_id] || @carted_product.cart_id
    @carted_product.product_id = params[:product_id] || @carted_product.product_id
    @carted_product.amount = params[:amount] || @carted_product.amount

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
