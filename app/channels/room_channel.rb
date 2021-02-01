class RoomChannel < ApplicationCable::Channel
  # calls when a client connects to the server
  def subscribed
    room = Room.find_by(name: params[:name])
    stream_for room
  end
  def unsubscribed
    stop_all_streams
  end
  def receive(data)
    _room = room
    case data["type"]
    when 'video_change'
      _room.url_video = data["video"]
      Rails.logger.debug data["video"]
      _room.save
    when 'message'
      message = Message.new
      message.room = room
      message.user = data["name"]
      message.message = data["message"]
      message.save
    end
    broadcast_to room, data
  end
  private
    def room
      Room.find_by(name: params[:name])
    end
  # calls when a client broadcasts data
end