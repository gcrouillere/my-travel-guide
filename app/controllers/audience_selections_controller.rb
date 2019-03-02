class AudienceSelectionsController < ApplicationController

  def index
    @audience_selections = AudienceSelection.all.order(updated_at: :desc)
    respond_to do |format|
      format.json {render json: @audience_selections}
    end
  end

end
