class MarkersController < ApplicationController
  def update
    @maker = Marker.find(params[:id])
    if @maker.update(marker_params)
      render json: @maker
    else
      render json: @maker.errors, status: :unprocessable_entity
    end
  end

  def create
    @maker = Marker.new(marker_params)
    if @maker.save
      render json: @maker
    else
      render json: @maker.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @marker = Marker.find(params[:id])
    @deleted_marker = @marker.as_json
    if @marker.destroy
      render json: @deleted_marker, status: :ok
    else
      render json: @marker.errors, status: :unprocessable_entity
    end
  end

  private

  def marker_params
    params.require(:marker).permit(:lat, :lng, :description, :logo, :map_id, :polyline_id)
  end
end
