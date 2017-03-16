export const SET_ME = "ME.SET_ME";
export const ADD_ACTIVITY = "ME.ADD_ACTIVITY";
export const REMOVE_ACTIVITY = "ME.REMOVE_ACTIVITY";


export const setMe = (me) => ({
  type : SET_ME,
  me : me,
});

export const addActivity = (activity) => ({
  type : ADD_ACTIVITY,
  activity : activity,
});

export const removeActivity = (activity) => ({
  type : REMOVE_ACTIVITY,
  activity : activity,
});
