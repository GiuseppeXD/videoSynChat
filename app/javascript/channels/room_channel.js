import consumer from "./consumer"

const startChannel = (name, setterData) => {
  const roomChannel = consumer.subscriptions.create({ channel: "RoomChannel", name: name}, {
    connected() {
      // Called when the subscription is ready for use on the server
      console.log("Connected to the chat")
    },
  
    disconnected() {
      // Called when the subscription has been terminated by the server
    },
  
    received(data) {
      setterData(data);
      console.log(data)
    },
  
    speak(message) {
      this.perform('speak', { message: message })
    }
  });

  return roomChannel;
}




export default startChannel;