class ArticlesController < ApplicationController
  before_action :authenticate_user!, only: [:new, :show, :edit]
  before_action :retrieve_article, only: [:show, :edit, :update]

  def index
    @articles = Article.all
      .order(updated_at: :desc)
      .includes(:text_contents)
      .includes(:maps)
      .includes(:photos)
      .includes(:double_contents)
      .includes(:audience_selections)
      .includes(:user)

    filter_by_audience if params[:audience_selection]
    filter_by_article_ids if params[:article_ids]
    filter_by_user
    filter_by_lat_lng if params[:mapBounds]
    limit_articles_to_display

    @audience_selection = AudienceSelection.all.order(updated_at: :desc)

    respond_to do |format|
      format.html { render "index" }
      format.json { render json: @articles.as_json(include: {
        text_contents: { methods: :class_name },
        user: {},
        audience_selections: {},
        maps: { methods: :class_name, include: { markers: {} }},
        double_contents: {
          include: { text_contents: {}, photos: {}, maps: {} },
          methods: [:class_name, :associated_instances_mapping]
        }
      })}
    end
  end

  def show
    @audience_selection = AudienceSelection.all.order(updated_at: :desc)

    @article = @article.as_json(include: {
      text_contents: { methods: :class_name },
      audience_selections: {},
      maps:{ methods: :class_name, include: { markers: {}, polylines: { include: { markers: {} } } } },
      photos:{ methods: :class_name },
      double_contents: {
          include: { text_contents: {}, photos: {}, maps: {} },
          methods: [:class_name, :associated_instances_mapping]
        }
    })

    respond_to do |format|
      format.html { render "content/home" }
      format.json { render json: @article }
    end
  end

  def create
    @article = Article.new(article_params)
    if @article.save
      render json: @article
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  def edit
    @audience_selection = AudienceSelection.all.order(updated_at: :desc)
    render "content/home"
  end

  def update
    if @article.update(article_params)
      render json: @article.as_json(include: { audience_selections: {} })
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  def new
    render "content/home"
  end

  def destroy
    @article = Article.find(params[:id])
    @article.audience_selections = []
    puts "#{@article.id} destroy"
    if @article.destroy
      head :no_content, status: :ok
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  def element_position_update
    #Prepare shit
    article = Article.find(params[:article])
    article_elements_json_mapped_sorted = article.elements_position_mapping.sort{|a,b| a[2] <=> b[2]}
    moving_element = article_elements_json_mapped_sorted[params[:positions][:init][:position].to_i]

    unless article_elements_json_mapped_sorted.blank?
      # Delete moving element
      article_elements_json_mapped_sorted.delete_at(params[:positions][:init][:position].to_i)
      # Insert moving element in new position
      article_elements_json_mapped_sorted.insert(params[:positions][:target][:position].to_i, moving_element)
      # Update all positions in DB
      article_elements_json_mapped_sorted.each_with_index do |element, index|
        article_elements_json_mapped_sorted[index][0]
        .constantize.find(article_elements_json_mapped_sorted[index][1])
        .update(position: index)
      end
    end

    render json: Article.find(params[:article]).as_json(include: {
      text_contents: { methods: :class_name },
      audience_selections: {},
      maps:{ methods: :class_name, include: { markers: {}, polylines: { include: { markers: {} } } } },
      photos: { methods: :class_name },
      double_contents: {
        include: { text_contents: {}, photos: {}, maps: {} },
        methods: [:class_name, :associated_instances_mapping]
      }
    })
  end

  private

  def article_params
    if params[:article][:audience_selection_ids].present?

      params[:article][:audience_selection_ids] = [] if params[:article][:audience_selection_ids] == [""]

      params
        .require(:article)
        .permit(:title, :audience_valid, :article_valid, :user_id)
        .merge(audience_selection_ids: params[:article][:audience_selection_ids].map(&:to_i).uniq)
    else
      params
        .require(:article)
        .permit(:title, :audience_valid, :article_valid, :user_id)
    end
  end

  def retrieve_article
    @article = Article.includes(:text_contents)
      .includes(:maps)
      .includes(:photos)
      .includes(:double_contents)
      .includes(:audience_selections)
      .find(params[:id])
  end

  def filter_by_audience
    ids = params[:audience_selection].split(",").map(&:to_i)
    @articles = @articles.joins(:audience_selections).where("audience_selections.id IN (?)", ids)
  end

  def filter_by_article_ids
    ids = params[:article_ids].split(",").map(&:to_i)
    @articles = @articles.where(id: ids)
  end

  def filter_by_user
    if params[:user]
      email = params[:user]
      @articles = @articles.joins(:user).where("users.email = ?", email)
    else
      @articles = @articles.where(article_valid: true)
    end
  end

  def filter_by_lat_lng
    map_bounds = params[:mapBounds].split(",").map(&:to_f)
    southLat = map_bounds[0]
    southLng = map_bounds[1]
    northLat = map_bounds[2]
    northLng = map_bounds[3]

    if northLng < southLng
      @articles = @articles.joins(:maps).where("maps.lat > ? AND maps.lat < ?", southLat, northLat).where("maps.lng > ? OR maps.lng < ?", southLng, northLng)
   else
      @articles = @articles.joins(:maps).where("maps.lat > ? AND maps.lng > ? AND maps.lat < ? AND maps.lng < ?", southLat, southLng, northLat, northLng)
    end
  end

  def limit_articles_to_display
    @articles = @articles.limit(50)
  end
end
