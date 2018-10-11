class UrlsController < ApplicationController
  def index
    @url = Url.last

    render json: @url.as_json
  end
  
  def create
    @url = Url.new(
                    link: params[:link]
                  )
    if @url.save
     render json: @url.as_json
    else
      render json: {errors: @url.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def destroy
    @url = Url.last
    @url.destroy
    render json: {message: "Most recent download url removed from database"}
  end
end
