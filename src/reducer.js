export const initialState = {
  user: [],
  email: [],
  sentMessage: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_CHANNEL':
      return {
        ...state,
        user: action.user,
      };
    case 'DIRECT_MESSAGE_SELECT':
      return {
        ...state,
        email: action.email,
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
