export function routeTranslator(params) {
  let translated = { ...params };

  if ('products' in params) {
    if (params.products === 'caje') translated.products = 'teas';
    if (params.products === 'prislusenstvi') translated.products = 'equipment';
  }

  if ('category' in params) {
    if (params.category === 'pu-erh') translated.products = 'puErh';
    if (params.category === 'cerveny') translated.products = 'red';
    if (params.category === 'zeleny') translated.products = 'green';
  }

  if ('subcategory' in params) {
    if (params.category === 'an-xi') translated.products = 'anXi';
    if (params.category === 'feng-huang') translated.products = 'fengHuang';
    if (params.category === 'wu-yi') translated.products = 'wuYi';
  }

  return translated;
}
