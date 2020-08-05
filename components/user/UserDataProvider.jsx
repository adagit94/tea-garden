import React, { useReducer, useEffect, createContext } from 'react';

import { initFirebase } from 'firebase/init-firebase';
import { initAuthObserver } from '../../firebase/auth';

const inits = {
  firebase: undefined,
  isAuthenticated: false,
  loading: false,
  address: undefined,
  orders: undefined,
  products: [],
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

    case 'syncData':
      return {
        ...state,
        [action.collection]: action.payload,
      };

    case 'setLoading':
      return {
        ...state,
        loading: action.value,
      };

    case 'setProducts':
      return {
        ...state,
        products: action.payload,
      };

    case 'setCart':
      return {
        ...state,
        shoppingCart: action.payload,
      };

    case 'updateCart':
      return {
        ...state,
        shoppingCart: {
          ...state.shoppingCart,
          [action.id]: action.payload,
        },
      };

    case 'updateCartItem':
      return {
        ...state,
        shoppingCart: {
          ...state.shoppingCart,
          [action.id]: {
            ...state.shoppingCart[action.id],
            ...action.payload
          },
        },
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
    const userLoading = window.localStorage.getItem('userLoading');
    const shoppingCartStr = window.localStorage.getItem('shoppingCart');
    
    function initUser(user) {
      userDispatch({ type: 'initUser', payload: user });
    }

    function clearUser() {
      userDispatch({ type: 'clearUser' });
    }

    function syncData(collection, data) {
      userDispatch({ type: 'syncData', collection, payload: data });
    }
    
    if (userLoading) {
      userDispatch({ type: 'setLoading', value: true });
    }

    if (shoppingCartStr) {
      const shoppingCartObj = JSON.parse(shoppingCartStr);

      userDispatch({ type: 'setCart', payload: shoppingCartObj });
    }

    initFirebase();
    initAuthObserver(initUser, clearUser, syncData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

//console.log(userState.products, 'products');
console.log(userState.shoppingCart, 'shoppingCart');

  return (
    <UserStateContext.Provider value={userState}>
      <UserDispatchContext.Provider value={userDispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}
