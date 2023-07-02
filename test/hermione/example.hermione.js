const { assert } = require('chai');
const webdriver = require('webdriver');

const bug_id = '?bug_id=10'  // Здесь пиши номер бага Пример:'?bug_id=6'


//Если не работает - установить selenium и в конфиге поставить webdriver вместо devtools https://github.com/gemini-testing/hermione#selenium-standalone



describe('Проверка адаптивности вёрстки', async function() {
    it('Тест на ширину 1440', async function(){
        await this.browser.setWindowSize(1440, 800);

        await this.browser.url('http://localhost:3000/hw/store');

        await this.browser.assertView('main1440', 'body');
    })

    it('Главная страница на ширине меньше 576px навигационное меню должно скрываться за "гамбургер" ', async function() {

        await this.browser.setWindowSize(575, 1500);


        await this.browser.url(`http://localhost:3000/hw/store${bug_id}`);

        
        await this.browser.assertView('main575', 'body');

    });

    it('при выборе элемента из меню "гамбургера", меню должно закрываться', async function() {
        
        await this.browser.setWindowSize(575, 1000);

        await this.browser.url(`http://localhost:3000/hw/store${bug_id}`);
        const mainLink = await this.browser.$('.Application-Brand');

        const hamburgerMenu = await this.browser.$('.Application-Toggler');
        await hamburgerMenu.click();

        const menuItems = await this.browser.$$('.nav-link');
        assert.isTrue(menuItems.length > 0, 'Меню не открыто');

        const menuItem = await this.browser.$('.nav-link:first-child');
        await menuItem.click();

        await mainLink.click();

        await this.browser.pause(1000)

        const isMenuVisible = await this.browser.$('.nav-link').isDisplayed();

        assert.isFalse(isMenuVisible, 'Меню не закрыто');

    }); 
})

describe('Проверка ссылок', async function() {

    it('должна содержать ссылки на страницы магазина ', async function() {

        await this.browser.setWindowSize(1440, 1000);

        await this.browser.pause(1000)


        await this.browser.url(`http://localhost:3000/hw/store${bug_id}`);

    
        const shopLink = await this.browser.$('.nav-link');

        assert.ok(await shopLink.isExisting(), 'Ссылка на страницу магазина не найдена');
        assert.ok(await shopLink.isDisplayed(), 'Ссылка на страницу магазина не видима');
    
        const shopHref = await shopLink.getAttribute('href');
    
        assert.ok(shopHref && shopHref.startsWith('/hw/store/'), 'Неверная ссылка на страницу магазина');
    
      });
    
      it('название магазина в шапке должно быть ссылкой на главную страницу', async function() {

        await this.browser.url(`http://localhost:3000/hw/store${bug_id}`);

        const mainLink = await this.browser.$('.Application-Brand');


        assert.ok(await mainLink.isExisting(), 'Ссылка на страницу магазина не найдена');
        assert.ok(await mainLink.isDisplayed(), 'Ссылка на страницу магазина не видима');
    
        const mainHref = await mainLink.getAttribute('href');
    
        assert.ok(mainHref && mainHref.startsWith('/hw/store/'), 'Неверная ссылка на страницу магазина');
    
      });
 
 
}); 


describe('Каталог', async function() {
    it('на странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"', async function() {
        await this.browser.setWindowSize(1440, 800);

        await this.browser.url(`http://localhost:3000/hw/store/catalog/0${bug_id}`);

        await this.browser.assertView('button', '.ProductDetails-AddToCart');
        
    });
});

describe('Корзина', async function() {
    it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async function() {
        await this.browser.setWindowSize(1440, 800);

        await this.browser.url(`http://localhost:3000/hw/store${bug_id}`);

        await this.browser.executeScript(
            'localStorage.setItem("example-store-cart", JSON.stringify({"0":{"name":"Ergonomic Mouse","count":6,"price":84}}));',
            []
          );

        await this.browser.url(`http://localhost:3000/hw/store/cart${bug_id}`);


        const clearBtn = await this.browser.$('.Cart-Clear');

        await clearBtn.click();

        await this.browser.refresh();

        await this.browser.assertView('cleartCart', 'body');

    });
});

describe('Проверка формы', async function(){
  
    it('Проверка валидации полей', async function(){
    await this.browser.setWindowSize(1440, 1000);
    await this.browser.url(`http://localhost:3000/hw/store${bug_id}`);

        await this.browser.executeScript(
            'localStorage.setItem("example-store-cart", JSON.stringify({"0":{"name":"Ergonomic Mouse","count":6,"price":84}}));',
            []
          );

    await this.browser.url(`http://localhost:3000/hw/store/cart${bug_id}`);;
    const inputName = await this.browser.$('#f-name')
    await inputName.setValue('Ваня')
    const inputPhone = await this.browser.$('#f-phone')
    await inputPhone.setValue('7877878787')
    const inputAdress = await this.browser.$('#f-address')
    await inputAdress.setValue('улица Пушкина дом Колотушкина')
    const buttonForm = await this.browser.$('.Form-Submit')
    await buttonForm.click();
    const invalidInput = await this.browser.$('.is-invalid')
    if(await invalidInput.isDisplayed()){
        throw new Error('Input невалидный');
    }
    }),

    it('Проверка валидации отправки формы', async function(){

        await this.browser.setWindowSize(1440, 1000);
        await this.browser.url(`http://localhost:3000/hw/store${bug_id}`);

        await this.browser.executeScript(
            'localStorage.setItem("example-store-cart", JSON.stringify({"0":{"name":"Ergonomic Mouse","count":6,"price":84}}));',
            []
          );

        await this.browser.url(`http://localhost:3000/hw/store/cart${bug_id}`);
        const inputName = await this.browser.$('#f-name')
        await inputName.setValue('Ваня')
        const inputPhone = await this.browser.$('#f-phone')
        await inputPhone.setValue('7877878787')
        const inputAdress = await this.browser.$('#f-address')
        await inputAdress.setValue('улица Пушкина дом Колотушкина')
        const buttonForm = await this.browser.$('.Form-Submit')
        await buttonForm.click();
        
        
        
        const cartMessage = await this.browser.$('.alert-danger')
        if(await cartMessage.isDisplayed()){
            throw new Error('CartMessage другого цвета');
        }
    })
    it('Проверка отправки формы', async function(){

        await this.browser.setWindowSize(1440, 1000);
        await this.browser.url(`http://localhost:3000/hw/store${bug_id}`);

        await this.browser.executeScript(
            'localStorage.setItem("example-store-cart", JSON.stringify({"0":{"name":"Ergonomic Mouse","count":6,"price":84}}));',
            []
          );

        await this.browser.url(`http://localhost:3000/hw/store/cart${bug_id}`);

        const inputName = await this.browser.$('#f-name')
        await inputName.setValue('Ваня')
        const inputPhone = await this.browser.$('#f-phone')
        await inputPhone.setValue('7877878787')
        const inputAdress = await this.browser.$('#f-address')
        await inputAdress.setValue('улица Пушкина дом Колотушкина')
        const buttonForm = await this.browser.$('.Form-Submit')
        await buttonForm.click();
        
        if(await buttonForm.isDisplayed()){
            throw new Error('Заказ не отправляется, ошибка в кнопке формы');
        }
    })
});
