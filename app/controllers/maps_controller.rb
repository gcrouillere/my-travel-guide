class MapsController < ApplicationController
  def update
    @map = Map.find(params[:id])
    if @map.update(map_params)
      render json: @map
    else
      render json: @map.errors, status: :unprocessable_entity
    end
  end

  def create
    @map = Map.new(map_params)
    if @map.save
      render json: @map
    else
      render json: @map.errors, status: :unprocessable_entity
    end
  end

  private

  def map_params
    params.require(:map).permit(:lat, :lng, :article_id)
  end
end
