class CartsController < ApplicationController
  def show
    @cart = Cart.find_by(uid: params[:id]) || Cart.find(params[:id])
    # ordered_products = @cart.carted_products.order('created_at' => :asc)
    # @cart.carted_products = ordered_products
    # binding.pry

    render 'show.json.jbuilder'
  end
  def create
    # this function will be called a lot when people are accessing their carts
    # checks to see if your cart exist
    @cart = Cart.find_by(uid: params[:uid])
    if @cart == nil #if it does NOT, make one
      @cart = Cart.new(
                        uid: params[:uid]
                      )
      if @cart.save
        render json: @cart.as_json 
      else 
        render json: {errors: @product.errors.full_messages}, status: :unprocessable_entity
      end
    else  #If this triggers, it means that you already have a cart
      render 'show.json.jbuilder'
    end

  end

  def destroy #will probably only ever use this for when an account is removed?
    @cart = Cart.find_by(params[:uid])
    @cart.destroy
    render json: {message: "Cart was deleted"}
  end
end
