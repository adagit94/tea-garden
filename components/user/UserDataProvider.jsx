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
  orderData: {},
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

    case 'setOrderData':
      return {
        ...state,
        orderData: action.payload,
      };

    case 'clearOrderData':
      return {
        ...state,
        orderData: {},
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

    if (firebaseReady) initAuthObserver(initUser, clearUser, syncData);
  }, [firebaseReady]);

  useEffect(() => {
    const isLogged = window.localStorage.getItem('isLogged');
    const shoppingCart = window.localStorage.getItem('shoppingCart');
    const orderData = window.localStorage.getItem('orderData');

    if (isLogged) {
      userDispatch({ type: 'setLoading', value: true });
    }

    if (shoppingCart) {
      userDispatch({ type: 'setCart', payload: JSON.parse(shoppingCart) });
    }

    if (orderData) {
      userDispatch({ type: 'setOrderData', payload: JSON.parse(orderData) });
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
