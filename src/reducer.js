export const initialState = {
  user: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_CHANNEL':
      return {
        ...state,
        user: action.user,
      };

    default:
      return state;
  }
};

export default reducer;
