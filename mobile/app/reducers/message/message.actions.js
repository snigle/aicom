export const ADD_MESSAGE = "MESSAGE.ADD_MESSAGE";


export const addMessage = ({ uuid, body }) => ({
  type : ADD_MESSAGE,
  message : { uuid : uuid, body : body },
});
