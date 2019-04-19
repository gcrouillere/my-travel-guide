class ArticlesController < ApplicationController

  def index
    @articles = Article.all.order(updated_at: :desc)
    respond_to do |format|
      format.html {render "content/home"}
      format.json {render json: @articles.as_json(include: :text_contents)}
    end
  end

  def show
    @article = Article.find(params[:id])
    respond_to do |format|
      format.html {render "content/home"}
      format.json { render json: @article.as_json(include: {
        text_contents: { methods: :class_name },
        audience_selections: {},
        maps:{ methods: :class_name, include: { markers: {}, polylines: { include: { markers: {} } } } },
        photos:{ methods: :class_name }
      })}
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
    render "content/home"
  end

  def update
    @article = Article.find(params[:id])
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
        article_elements_json_mapped_sorted[index][0].constantize.find(article_elements_json_mapped_sorted[index][1]).update(position: index)
      end
    end

    render json: Article.find(params[:article]).as_json(include: {
      text_contents: { methods: :class_name },
      audience_selections: {},
      maps:{ methods: :class_name, include: { markers: {}, polylines: {} } },
      photos: { methods: :class_name },
    })
  end

  private

  def article_params
    if params[:article][:audience_selection_ids].present?
      params[:article][:audience_selection_ids] = [] if params[:article][:audience_selection_ids] == [""]
      params.require(:article).permit(:title, :audience_valid).merge(audience_selection_ids: params[:article][:audience_selection_ids].map(&:to_i).uniq)
    else
      params.require(:article).permit(:title, :audience_valid)
    end
  end
end
