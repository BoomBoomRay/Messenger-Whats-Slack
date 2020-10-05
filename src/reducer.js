export const initialState = {
  user: [],
  email: '',
  selectedBoolean: false,
  userSentMg: '',
  sentMessage: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_CHANNEL':
      return {
        ...state,
        user: action.user,
        selectedBoolean: action.selectedBoolean,
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
        userSentMg: action.userSentMg,
      };
    default:
      return state;
  }
};

export default reducer;
