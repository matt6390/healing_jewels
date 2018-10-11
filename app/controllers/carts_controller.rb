class CartsController < ApplicationController
  def create
    @cart = Cart.new(
                      uid: params[:uid]
                    )
    if @cart.save
      render json: @cart.as_json 
    else 
      render json: {errors: @product.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def destroy
    @cart = Cart.find_by(params[:uid])
    @cart.destroy
    render json: {message: "Cart was deleted"}
  end
end
