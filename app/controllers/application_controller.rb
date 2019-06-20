class ApplicationController < ActionController::Base

  def layout_by_resource
    if devise_controller?
      "devise"
    else
      "application"
    end
  end
end
