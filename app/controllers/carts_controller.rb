class CartsController < ApplicationController
  def show
    @cart = Cart.find_by(uid: params[:uid])
     render json: @cart.as_json
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
      render json: {message: "Cart already made"}
    end

  end

  def destroy #will probably only ever use this for when an account is removed?
    @cart = Cart.find_by(params[:uid])
    @cart.destroy
    render json: {message: "Cart was deleted"}
  end
end
