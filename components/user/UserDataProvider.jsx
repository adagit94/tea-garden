import React, { useReducer, useEffect, createContext, useContext } from 'react';

import { initAuthObserver } from '../../firebase/auth';
import { AppStateContext } from 'pages/_app';

const inits = {
  firebase: undefined,
  isAuthenticated: false,
  loading: false,
  address: undefined,
  orders: undefined,
  products: {},
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

    case 'updateProduct':
      return {
        ...state,
        products: {
          ...state.products,
          [action.id]: {
            ...state.products[action.id],
            ...action.payload,
          },
        },
      };

    case 'setCart':
      return {
        ...state,
        shoppingCart: action.payload,
      };

    case 'clearCart':
      return {
        ...state,
        shoppingCart: {},
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
            ...action.payload,
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

  const firebaseReady = useContext(AppStateContext);

  const { loading } = userState;

  useEffect(() => {
    function initUser(user) {
      userDispatch({ type: 'initUser', payload: user });
    }

    function clearUser() {
      userDispatch({ type: 'clearUser' });
    }

    function syncData(collection, data) {
      userDispatch({ type: 'syncData', collection, payload: data });
    }

    if (firebaseReady) {
      initAuthObserver(initUser, clearUser, syncData);

      const shoppingCartStr = window.localStorage.getItem('shoppingCart');

      if (shoppingCartStr) {
        const shoppingCartObj = JSON.parse(shoppingCartStr);

        userDispatch({ type: 'setCart', payload: shoppingCartObj });
      }
    }
  }, [firebaseReady]);

  useEffect(() => {
    if (window.localStorage.getItem('isLogged')) {
      userDispatch({ type: 'setLoading', value: true });
    }
  }, []);

  return (
    <UserStateContext.Provider value={userState}>
      <UserDispatchContext.Provider value={userDispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}
