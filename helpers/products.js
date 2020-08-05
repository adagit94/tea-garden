export function saveProduct(id, shoppingCart, stateUpdater, data) {
  window.localStorage.setItem(
    'shoppingCart',
    JSON.stringify({ ...shoppingCart, [id]: data })
  );

  stateUpdater({ type: 'updateCart', id, payload: data });
}

export function deleteProduct(id, shoppingCart, stateUpdater) {
  let data = { ...shoppingCart };

  delete data[id];

  window.localStorage.setItem('shoppingCart', JSON.stringify(data));

  stateUpdater({ type: 'setCart', payload: data });
}

export function updateProduct(operation, id, shoppingCart, stateUpdater, data) {
  const product = shoppingCart[id];

  if (operation === 'updateAmount') {
    window.localStorage.setItem(
      'shoppingCart',
      JSON.stringify({
        ...shoppingCart,
        [id]: {
          ...product,
          ...data,
        },
      })
    );

    stateUpdater({
      type: 'updateCartItem',
      id,
      payload: {
        ...data,
      },
    });
  }
}
