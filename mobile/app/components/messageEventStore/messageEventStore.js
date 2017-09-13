import ApiCache from "../../apiCache/apiCache";

class MessageEventStore {
  constructor() {
    this.cache = new ApiCache("eventMessages", 60 * 24);
  }

  addMessage(eventId, message) {
    let self = this;
    this.cache.get(eventId).then((messages) => {
      messages[eventId] = message;
      return self.cache.set(eventId, messages);
    });
  }

  setReceived(eventId, messageId) {
    let self = this;
    this.cache.get(eventId).then((messages) => {
      if (!messages[eventId]) {
        throw("can't set received : message not found");
      }
      messages[eventId].received = true;
      return self.cache.set(eventId, messages);
    });
  }

  reset() {
    return this.cache.reset();
  }

}

let singleton = new MessageEventStore();
export default singleton;
