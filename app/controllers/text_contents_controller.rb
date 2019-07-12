class TextContentsController < ApplicationController
  def update
    @text_content = TextContent.find(params[:id])
    if @text_content.update(text_content_params)
      render json: @text_content.as_json(methods: :class_name)
    else
      render json: @text_content.errors, status: :unprocessable_entity
    end
  end

  def create
    @text_content = TextContent.new(text_content_params_at_create)
    if @text_content.save
      render json: @text_content.as_json(methods: :class_name)
    else
      render json: @text_content.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @text_content = TextContent.find(params[:id])
    @deleted_text_content = @text_content.as_json(methods: :class_name)
    if @text_content.destroy
      render json: @deleted_text_content, status: :ok
    else
      render json: @text_content.errors, status: :unprocessable_entity
    end
  end

  private

  def text_content_params_at_create
    params.require(:text_content).permit(:text, :article_id).merge(position: define_initial_position)
  end

  def text_content_params
    params.require(:text_content).permit(:text, :position, :article_id)
  end

  def define_initial_position
    params[:text_content][:position].present? ? params[:text_content][:position].to_i : Article.find(params[:text_content][:article_id]).elements_position_mapping.size
  end
end
