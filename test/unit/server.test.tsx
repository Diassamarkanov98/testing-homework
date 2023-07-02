import '@testing-library/jest-dom/extend-expect';
import { ExampleStore } from '../../src/server/data'


const store = new ExampleStore();
const bugId: string = process.env.BUG_ID || '0'; 
const bugIdNumber: number = Number(bugId); 

test('отображает продукты, полученные с сервера', async () => {
    const products = store.getAllProducts(bugIdNumber); 
    products.forEach((product) => {
    if (product.id === undefined) {
        throw new Error('Missing id property in product');
        }
    if (product.name === undefined) {
      throw new Error('Missing name property in product');
    }
    if (product.price === undefined) {
        throw new Error('Missing price property in product');
      }
    });
});

