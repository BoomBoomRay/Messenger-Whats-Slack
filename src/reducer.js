export const initialState = {
  user: 'mainChannel',
  email: '',
  nameOfChannel: '',
  deleted: false,
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
    case 'NEW_CREATED_CHANNEL':
      return {
        ...state,
        nameOfChannel: action.nameOfChannel,
        deleted: action.deleted,
      };
    // case 'DELETED_CHANNEL_DM':
    //   return {
    //     ...state,
    //     deleted: action.deleted,
    //   };
    default:
      return state;
  }
};

export default reducer;
