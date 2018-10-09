class ProductsController < ApplicationController
  def index
    @products = Product.all

    render json: @products.as_json

  end

  def show
    @product = Product.find(params[:id])

    render 'show.json.jbuilder'
  end
  
  def create
    @product = Product.new(
                            name: params[:name],
                            description: params[:description],
                            price: params[:price]
                          )
    if @product.save
     render 'show.json.jbuilder'
    else
      render json: {errors: @product.errors.full_messages}, status: :unprocessable_entity
    end
  end
  
  def update
    @product = Product.find(params[:id])

    @product.name = params[:name] || @product.name
    @product.description = params[:description] || @product.description
    @product.price = params[:price] || @product.price

    if @product.save
     render 'show.json.jbuilder'
    else
      render json: {errors: @product.errors.full_messages}, status: :unprocessable_entity
    end
  end
  
  def delete 
    @product = Product.find(params[:id])
    @product.destroy
    render json: {message: 'Product succesfully removed'} 
  end
end
