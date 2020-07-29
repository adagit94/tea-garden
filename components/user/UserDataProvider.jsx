import Router from 'next/router';
import React, { useReducer, useEffect, createContext } from 'react';

import { initFirebase } from 'firebase/init-firebase';
import { initAuthObserver } from '../../firebase/auth';

const inits = {
  firebase: undefined,
  isAuthenticated: false,
  loading: false,
  addresses: undefined,
  orders: undefined,
  shoppingCart: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'initUser':
      return {
        ...state,
        firebase: action.payload,
        isAuthenticated: true,
        loading: false,
      };

    case 'clearUser':
      return {
        ...inits,
        shoppingCart: state.shoppingCart,
      };

    case 'syncUser':
      return {
        ...state,
        ...action.payload,
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

    function syncUser(doc) {
      userDispatch({ type: 'syncUser', payload: doc });
    }

    if (window.localStorage.getItem('userLoading') === 'true') {
      userDispatch({ type: 'setLoading', value: true });
    }

    initFirebase();
    initAuthObserver(initUser, clearUser, syncUser);
  }, []);

  useEffect(() => {
    console.log(userState);
  });

  return (
    <UserStateContext.Provider value={userState}>
      <UserDispatchContext.Provider value={userDispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}
