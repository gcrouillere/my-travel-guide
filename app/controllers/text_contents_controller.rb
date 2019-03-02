class TextContentsController < ApplicationController
  def update
    @text_content = TextContent.find(params[:id])
    if @text_content.update(text_content_params)
      render json: @text_content
    else
      render json: @text_content.errors, status: :unprocessable_entity
    end
  end

  def create
    @text_content = TextContent.new(text_content_params)
    if @text_content.save
      render json: @text_content
    else
      render json: @text_content.errors, status: :unprocessable_entity
    end
  end

  private

  def text_content_params
    params.require(:text_content).permit(:text, :article_id)
  end
end
