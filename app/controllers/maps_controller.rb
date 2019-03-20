class MapsController < ApplicationController
  def update
    @map = Map.find(params[:id])
    if @map.update(map_params)
      render json: @map.as_json(methods: :class_name)
    else
      render json: @map.errors, status: :unprocessable_entity
    end
  end

  def create
    @map = Map.new(map_params_at_create)
    if @map.save
      render json: @map.as_json(methods: :class_name)
    else
      render json: @map.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @map = Map.find(params[:id])
    @deleted_map = @map.as_json(methods: :class_name)
    if @map.destroy
      render json: @deleted_map, status: :ok
    else
      render json: @map.errors, status: :unprocessable_entity
    end
  end

  private

  def map_params_at_create
    params.require(:map).permit(:lat, :lng, :zoom, :name, :article_id).merge(position: define_position_initial_position)
  end

  def map_params
    params.require(:map).permit(:lat, :lng, :zoom, :position, :name, :article_id)
  end

  def define_position_initial_position
    params[:map][:position].present? ? params[:map][:position].to_i : Article.find(params[:map][:article_id]).elements_position_mapping.size
  end
end
