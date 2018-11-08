Rails.application.routes.draw do
  post 'user_token' => 'user_token#create'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get "/products" => 'products#index'
  get "/products/:id" => 'products#show'
  post "/products" => 'products#create'
  patch "/products/:id/update" => 'products#update'  
  delete "/products/:id" => 'products#destroy'

  get "/users" => 'users#index'
  get "/users/:id" => 'users#show'
  post "/users" => 'users#create'
  patch "/users/:id" => 'users#update'  
  delete "/users" => 'users#destroy'

  get "/urls" => 'urls#index'
  get "/urls/:id" => 'urls#show'
  post "/urls" => 'urls#create'
  patch "/urls/:id" => 'urls#update'  
  delete "/urls" => 'urls#destroy'

  get "/carts" => 'carts#index'
  get "/carts/myCart" => 'carts#myCart'
  get "/carts/:id" => 'carts#show'
  post "/carts" => 'carts#create'
  patch "/carts/:id" => 'carts#update'  
  delete "/carts" => 'carts#destroy'

  get "/carted_products" => 'carted_products#index'
  get "/carted_products/:id/cart" => 'carted_products#cart'
  get "/carted_products/:id" => 'carted_products#show'
  post "/carted_products" => 'carted_products#create'
  patch "/carted_products/:id" => 'carted_products#update'  
  delete "/carted_products" => 'carted_products#destroy'
end
