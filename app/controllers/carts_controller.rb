class CartsController < ApplicationController
  def show
    @cart = Cart.find_by(user_id: current_user.id) || Cart.find(params[:id])
    # ordered_products = @cart.carted_products.order('created_at' => :asc)
    # @cart.carted_products = ordered_products
    # binding.pry

    render 'show.json.jbuilder'
  end
  def myCart
    @cart = Cart.find_by(user_id: current_user.id)
    if @cart
      render 'show.json.jbuilder'
    else
      render json: {errors: @cart.errors.full_messages}, status: :unprocessable_entity
    end
  end
  def create
    @cart = Cart.new(
                      user_id: params[:user_id]
                    )
    if @cart.save
      render 'show.json.jbuilder'
    else 
      render json: {errors: @cart.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def destroy #will probably only ever use this for when an account is removed?
    @cart = Cart.find_by(params[:user_id])
    @cart.destroy
    render json: {message: "Cart was deleted"}
  end
end
