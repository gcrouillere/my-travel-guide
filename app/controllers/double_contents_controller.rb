class DoubleContentsController < ApplicationController
  def update
    @double_content = DoubleContent.find(params[:id])
    if @double_content.update(double_content_params)
      render json: @double_content.as_json(methods: :class_name)
    else
      render json: @double_content.errors, status: :unprocessable_entity
    end
  end

  def create
    @double_content = DoubleContent.new(double_content_params_at_create)
    if @double_content.save
      render json: @double_content.as_json(methods: :class_name)
    else
      render json: @double_content.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @double_content = DoubleContent.find(params[:id])
    @deleted_double_content = @double_content.as_json(methods: :class_name)
    if @double_content.destroy
      render json: @deleted_double_content, status: :ok
    else
      render json: @double_content.errors, status: :unprocessable_entity
    end
  end

  private

  def double_content_params_at_create
    params.require(:double_content).permit(:height, :article_id).merge(position: define_initial_position)
  end

  def double_content_params
    params.require(:double_content).permit(:position, :height, :article_id)
  end

  def define_initial_position
    params[:double_content][:position].present? ? params[:double_content][:position].to_i : Article.find(params[:double_content][:article_id]).elements_position_mapping.size
  end
end
