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
  delete "/urls" => 'urls#destroy'

  get "/carts" => 'carts#index'
  get "/carts/:id" => 'carts#show'
  post "/carts" => 'carts#create'
  patch "/carts/:id" => 'carts#update'  
  delete "/carts" => 'carts#destroy'

  get "/carted_products" => 'carted_products#index'
  get "/carted_products/:id" => 'carted_products#show'
  post "/carted_products" => 'carted_products#create'
  patch "/carted_products/:id" => 'carted_products#update'  
  delete "/carted_products" => 'carted_products#destroy'
end
