Rails.application.routes.draw do
  devise_for :users
  root to: "articles#index"

  post '/articles/element_position_update', to: "articles#element_position_update"
  get '/photos/remove_photo_from_cloudinary_only', to: "photos#remove_photo_from_cloudinary_only"

  resources :articles
  resources :audience_selections
  resources :text_contents
  resources :maps
  resources :polylines
  resources :markers
  resources :photos
  resources :double_contents

  resources :users, only: [:show] do
    resources :articles, only: [:index, :show]
  end
end
