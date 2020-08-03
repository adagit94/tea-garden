export function collectionTranslator(collection) {
  if (collection === 'pu-erh') {
    collection = 'puErh';
  } else if (collection === 'cerveny') {
    collection = 'red';
  } else if (collection === 'zeleny') {
    collection = 'green';
  }

  return collection;
}
