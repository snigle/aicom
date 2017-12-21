export const ADD_MESSAGE = "MESSAGE.ADD_MESSAGE";
export const MARK_AS_RECEIVED = "MESSAGE.MARK_AS_RECEIVED";


export const addMessage = ({ uuid, body, senderID }) => ({
  type : ADD_MESSAGE,
  message : { uuid, body, senderID },
});

export const markAsReceived = (uuid) => ({
  type : MARK_AS_RECEIVED,
  uuid : uuid,
});
