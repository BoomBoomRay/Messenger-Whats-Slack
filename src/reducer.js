export const initialState = {
  user: 'mainChannel',
  email: '',
  isChannel: true,
  selectedBoolean: false,
  userSentMsg: '',
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
        isChannel: action.isChannel,
      };
    case 'SUBMIT_MESSAGE':
      return {
        ...state,
        sentMessage: action.sentMessage,
        userSentMsg: action.userSentMsg,
      };
    default:
      return state;
  }
};

export default reducer;
