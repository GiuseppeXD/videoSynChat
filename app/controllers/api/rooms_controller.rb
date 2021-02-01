module Api
  class RoomsController < ActionController::Base
    skip_before_action :verify_authenticity_token
    def show
      room = Room.find_by(name: params[:name])
      return head 404 unless room
      messages = room.messages
      render json: {
        room: room,
        messages: messages
      }
    end

    def create
      room = Room.find_or_initialize_by(name: params[:name])
      room.save
      messages = room.messages
      render json: {
        room: room,
        messages: messages.to_json
      }
    end
  end
end