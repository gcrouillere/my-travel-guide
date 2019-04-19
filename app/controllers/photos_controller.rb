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
      # binding.pry
      render json: @photos.as_json(methods: :class_name)
    else
      render json: @photos.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @photos = Photo.find(params[:id])
    @deleted_photo = @photos.as_json(methods: :class_name)
    if @photos.destroy
      render json: @deleted_photo, status: :ok
    else
      render json: @photos.errors, status: :unprocessable_entity
    end
  end

  private

  def photo_params_at_create
    params.require(:photo).permit(:public_id, :version, :signature, :width, :height, :format, :resource_type,
      :url, :original_filename, :article_id).merge(position: define_initial_position)
  end

  def photo_params
    params.require(:photo).permit(:public_id, :version, :signature, :width, :height, :format, :resource_type,
      :url, :original_filename, :position, :article_id)
  end

  def define_initial_position
    params[:photo][:position].present? ? params[:photo][:position].to_i : Article.find(params[:photo][:article_id]).elements_position_mapping.size
  end
end
