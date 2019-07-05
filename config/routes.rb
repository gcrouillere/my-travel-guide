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

  post '/articles/element_position_update', to: "articles#element_position_update"
end
