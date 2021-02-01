Rails.application.routes.draw do
  root 'pages#index'

  namespace :api do 
    post '/room', to: 'rooms#create'
    get '/room/:name', to: 'rooms#show' 
  end

  get '*path', to: 'pages#index', via: :all
end