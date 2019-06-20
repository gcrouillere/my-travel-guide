class ApplicationController < ActionController::Base
  before_action :xx

  def layout_by_resource
    if devise_controller?
      "devise"
    else
      "application"
    end
  end

  def xx
    puts params
    puts request.referrer
  end
end
