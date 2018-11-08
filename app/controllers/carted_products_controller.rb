class CartedProductsController < ApplicationController
  def index
    @carted_products = CartedProduct.find_by(cart_id: params[:cart_id])
    render 'index.json,jbuilder'
  end

  # this is used to keep the order that each carted Product was placed inside of the cart
  def cart
    @carted_products = CartedProduct.all
    @carted_products = @carted_products.where(cart_id: params[:id])
    @carted_products = @carted_products.order('created_at' => :asc)
    render 'index.json.jbuilder'
  end

  def show
    # for if I ever need the show function
    @carted_products = CartedProduct.find_by(cart_id: params[:id])
    render 'index.json.jbuilder'
  end

  def create
    if current_user
      @carted_product = CartedProduct.new(
                                           cart_id: current_user.cart.id, 
                                           product_id: params[:product_id],
                                           amount: params[:amount]
                                          )
      if @carted_product.save 
       render json: @carted_product.as_json
      else
        render json: {errors: @carted_product.errors.full_messages}, status: :unprocessable_entity
      end
    else
      render json: {errors: "Please Log In"}, status: :authenticity_error
    end
  end

  def update
    #updates will happen when a Product is added or 1 of multiple items is removed from the cart
    #Like if you accidentally said 2, but really just want 1
    @carted_product = CartedProduct.find(params[:id]) || CartedProduct.find_by(cart_id: params[:cart_id], product_id: params[:product_id])

    @carted_product.cart_id = params[:cart_id] || @carted_product.cart_id
    @carted_product.product_id = params[:product_id] || @carted_product.product_id
    @carted_product.amount = params[:amount] || @carted_product.amount

    # When viewing a product in the cart, setting its amount to zero will remove the product from your cart altogether. This is done throughthe update function automatically, rather than have to call the "delete" function
    if @carted_product.amount == 0
      @carted_product.destroy
      render json: {message: "Removed From Cart"}
    elsif @carted_product.save
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
