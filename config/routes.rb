Rails.application.routes.draw do
  devise_for :users
  root to: "articles#index"

  resources :articles
  resources :audience_selections
  resources :text_contents
  resources :maps
  resources :polylines
  resources :markers
  resources :photos

  resources :users, only: [:show] do
    resources :articles, only: [:index, :show]
  end


  post '/articles/element_position_update', to: "articles#element_position_update"
end
