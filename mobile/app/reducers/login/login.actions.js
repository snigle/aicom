export const SET_LOGIN = "LOGIN.SET_LOGIN";
export const LOG_OUT = "LOGIN.LOG_OUT";


export const setLogin = (user) => ({
  type : SET_LOGIN,
  user : user,
});
