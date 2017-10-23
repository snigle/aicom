export const ADD_MESSAGE = "MESSAGE.ADD_MESSAGE";
export const MARK_AS_RECEIVED = "MESSAGE.MARK_AS_RECEIVED";


export const addMessage = ({ uuid, body }) => ({
  type : ADD_MESSAGE,
  message : { uuid : uuid, body : body },
});

export const markAsReceived = (uuid) => ({
  type : MARK_AS_RECEIVED,
  uuid : uuid,
});
