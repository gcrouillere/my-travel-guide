class PhotosController < ApplicationController
  def update
    @photos = Photo.find(params[:id])
    if @photos.update(photo_params)
      render json: @photos.as_json(methods: :class_name)
    else
      render json: @photos.errors, status: :unprocessable_entity
    end
  end

  def create
    @photos = Photo.new(photo_params_at_create)
    if @photos.save
      render json: @photos.as_json(methods: :class_name)
    else
      render json: @photos.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @photos = Photo.find(params[:id])
    @deleted_photo = @photos.as_json(methods: :class_name)
    if @photos.destroy
      Cloudinary::Api.delete_resources([@deleted_photo["public_id"]])
      render json: @deleted_photo, status: :ok
    else
      render json: @photos.errors, status: :unprocessable_entity
    end
  end

  def remove_photo_from_cloudinary_only
    public_id = params[:public_id]
    Cloudinary::Api.delete_resources(public_id)
    head :no_content, status: :ok
  end

  private

  def photo_params_at_create
    if params[:photo][:double_content_id]
      params.require(:photo).permit(:public_id, :version, :signature, :original_width, :original_height, :format, :resource_type,
      :url, :original_filename, :bytes, :position, :double_content_id).merge(position: params[:photo][:position])
    else
      params.require(:photo).permit(:public_id, :version, :signature, :original_width, :original_height, :format, :resource_type,
      :url, :original_filename, :bytes, :position, :article_id).merge(position: define_initial_position)
    end
  end

  def photo_params
    params.require(:photo).permit(:public_id, :version, :signature, :original_width, :original_height, :width, :height,
      :css_width, :css_height, :format, :resource_type, :url, :cropped_url, :original_filename, :display_title, :position,
      :article_id, :double_content_id)
  end

  def define_initial_position
    params[:photo][:position].present? ?
      params[:photo][:position].to_i :
      Article.find(params[:photo][:article_id]).elements_position_mapping.size
  end
end
