Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get "/products" => 'products#index'
  get "/products/:id" => 'products#show'
  post "/products" => 'products#create'
  patch "/products/:id" => 'products#update'  
  delete "/products/:id" => 'products#destroy'

  get "/urls" => 'urls#index'
  get "/urls/:id" => 'urls#show'
  post "/urls" => 'urls#create'
  patch "/urls/:id" => 'urls#update'  
  delete "/urls/:id" => 'urls#destroy'
end
