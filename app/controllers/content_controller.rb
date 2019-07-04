class ContentController < ApplicationController
  before_action :authenticate_user!
  def home
    @audience_selection = AudienceSelection.all.order(updated_at: :desc)
  end
end
