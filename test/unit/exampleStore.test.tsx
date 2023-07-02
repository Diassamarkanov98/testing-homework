import { ExampleStore } from '../../src/server/data'

describe('ExampleStore', () => {
  let exampleStore: ExampleStore;

  beforeEach(() => {
    exampleStore = new ExampleStore();
  });

  test('getAllProducts возвращает массив ProductShortInfo', () => {
    const bugId = 1; 

    const products = exampleStore.getAllProducts(bugId);

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    products.forEach((product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
    });
  });

  test('getProductById возвращает правильный продукт', () => {
    const id = 1;

    const product = exampleStore.getProductById(id);

    expect(product).toBeDefined();
    expect(product?.id).toBe(id);
  });

});