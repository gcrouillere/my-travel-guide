Rails.application.routes.draw do
  root to: "content#home"

  resources :articles
  resources :audience_selections
  resources :text_contents
  resources :maps
  resources :markers

  post '/articles/element_position_update', to: "articles#element_position_update"
end
