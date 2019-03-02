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
      format.json {render json: @article.as_json(include: [:text_contents, :audience_selections, :maps])}
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
    # binding.pry
    if @article.update(article_params)
      render json: @article.as_json(include: [:text_contents, :audience_selections])
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

  private

  def article_params
    params.require(:article).permit(:title).merge(audience_selection_ids: AudienceSelection.where(audience: params[:article][:audience_selections]).map(&:id).uniq)
  end

end
