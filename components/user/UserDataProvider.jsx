import React, { useReducer, useEffect, createContext } from 'react';

import { initFirebase } from 'firebase/init-firebase';
import { initAuthObserver } from '../../firebase/auth';

const inits = {
  firebase: undefined,
  isAuthenticated: false,
  loading: false,
  address: undefined,
  orders: undefined,
  shoppingCart: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'initUser':
      return {
        firebase: action.payload,
        isAuthenticated: true,
        loading: false,
      };

    case 'clearUser':
      return {
        ...inits,
        shoppingCart: state.shoppingCart,
      };

    case 'setLoading':
      return {
        ...state,
        loading: action.value,
      };

    default:
      return state;
  }
}

export const UserStateContext = createContext();
export const UserDispatchContext = createContext();

export default function UserDataProvider({ children }) {
  const [userState, userDispatch] = useReducer(reducer, inits);

  useEffect(() => {
    function initUser(user) {
      userDispatch({ type: 'initUser', payload: user });
    }

    function clearUser() {
      userDispatch({ type: 'clearUser' });
    }

    initFirebase();
    initAuthObserver(initUser, clearUser);
  }, []);

  return (
    <UserStateContext.Provider value={userState}>
      <UserDispatchContext.Provider value={userDispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}
