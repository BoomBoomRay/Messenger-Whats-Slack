export const initialState = {
  user: [],
  sentMessage: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_CHANNEL':
      return {
        ...state,
        user: action.user,
      };
    case 'SUBMIT_MESSAGE':
      return {
        ...state,
        sentMessage: action.sentMessage,
      };
    default:
      return state;
  }
};

export default reducer;
