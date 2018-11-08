class UsersController < ApplicationController
  def index
    @users = User.all
    render 'index.json.jbuilder'
  end
  def show
    @user = User.find(current_user.id)
    render json: @user.as_json
  end

  def create
    @user = User.new(
      name: params[:name],
      email: params[:email],
      password: params[:password],
      password_confirmation: params[:password_confirmation]
    )
    if @user.save
      render 'show.json.jbuilder'
    else
      render json: {errors: @user.errors.full_messages}, status: :bad_request
    end
  end
end
