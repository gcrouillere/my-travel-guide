class PolylinesController < ApplicationController

  def show
    @polyline = Polyline.find(params[:id])
    render json: @polyline.as_json(include: :markers)
  end

  def update
    @polyline = Polyline.find(params[:id])
    if @polyline.update(polyline_params)
      render json: @polyline.as_json(include: :markers)
    else
      render json: @polyline.errors, status: :unprocessable_entity
    end
  end

  def create
    @polyline = Polyline.new(polyline_params)
    if @polyline.save
      render json: @polyline
    else
      render json: @polyline.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @polyline = Polyline.find(params[:id])
    @deleted_polyline = @polyline.as_json
    if @polyline.destroy
      render json: @deleted_polyline, status: :ok
    else
      render json: @polyline.errors, status: :unprocessable_entity
    end
  end

  private

  def polyline_params
    params.require(:polyline).permit(:distance_displayed, :map_id)
  end
end
