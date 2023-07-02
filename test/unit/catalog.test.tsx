import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Catalog } from '../../src/client/pages/Catalog';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AxiosResponse } from 'axios';
import { ExampleApi, CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import { Product, ProductShortInfo } from '../../src/common/types';
import { ProductDetails } from '../../src/client/components/ProductDetails'
import { Application } from '../../src/client/Application';
import { Cart } from '../../src/client/pages/Cart';
const basename = '/hw/store';
const api = new ExampleApi(basename);

api.getProducts = async (): Promise<AxiosResponse<ProductShortInfo[], any>> => {
    const customProducts: ProductShortInfo[] = [
      {
        id: 1,
        name: 'Product 1',
        price: 100,
      },
      {
        id: 2,
        name: 'Product 2',
        price: 200,
      },
    ];
  
    const response: AxiosResponse<ProductShortInfo[], any> = {
      data: customProducts,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
  
    return Promise.resolve(response);
  };
const cart = new CartApi();
const store = initStore(api, cart);
api.getProductById = async (id: number): Promise<AxiosResponse<Product, any>> => {
  const product: Product = {
    id: 1,
    name: 'Product 1',
    price: 100,
    description: 'Sample description',
    color: 'Red',
    material: 'Cotton',
  };

  const response: AxiosResponse<Product, any> = {
    data: product,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };

  return Promise.resolve(response);
};

describe('Каталог', () => {

  test('Каталог отображается правильно', ()=>{
    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );

    render(application);
    const textElement = screen.getByText('Catalog');
    expect(textElement).toBeInTheDocument;
  })


  test('отображает продукты, полученные с сервера', async () => {

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );

    render(application);
    await screen.findByText('Product 1');
    await screen.findByText('Product 2');

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
});



describe('Информация о продукте', () => {
  test('предоставляет подробную информацию о продукте', async () => {
    jest.spyOn(api, 'getProductById').mockResolvedValue({
      data: {
        id: 0,
        name: 'Product 1',
        price: 100,
        description: 'Sample description',
        color: 'Red',
        material: 'Cotton',
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });
  
    render(
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Application />
          <ProductDetails product={await (await api.getProductById(0)).data} />
        </Provider>
      </BrowserRouter>
    );
  
    await screen.findByText('Product 1');
    await screen.findByText('Sample description');
    await screen.findByText('$100');
    await screen.findByText('Color');
    await screen.findByText('Red');
    await screen.findByText('Material');
    await screen.findByText('Cotton');
  
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Sample description')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Material')).toBeInTheDocument();
    expect(screen.getByText('Cotton')).toBeInTheDocument();
  });

  test('добавляет товар в корзину и увеличивает количество при нажатии кнопки и проверяет "Товар в корзине"', async () => {
    jest.spyOn(api, 'getProductById').mockResolvedValue({
      data: {
        id: 1,
        name: 'Product 1',
        price: 100,
        description: 'Sample description',
        color: 'Red',
        material: 'Cotton',
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    render(
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Application />
          <ProductDetails product={await (await api.getProductById(1)).data} />
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    await screen.findByText('Product 1');
    await screen.findByText('$100');

    fireEvent.click(screen.getByText('Add to Cart'));
    fireEvent.click(screen.getByText('Add to Cart'));

    try {
      await screen.findByText('Item in cart');
      expect(screen.getByText('Item in cart')).toBeInTheDocument();
    } catch (error) {
      throw new Error('Отсутствует элемент "Товар в корзине"');
    }
  });
});
