import Product from './product';
import { Collection } from '../support/backbone';
import { BASE_URL } from '../config';

export default Collection.extend({
  model: Product,
  url: `${BASE_URL}/products.json`
});
