const testUrl = 'http://localhost:4000';
const modal = '[data-cy="modal"]';
const bun = '[data-cy="bun"]';
const main = '[data-cy="main"]';
const burgerConstructor = '[data-cy="burgerConstructor"]';
const closeModalButton = '[data-cy="closeModalButton"]';
const orderButton = '[data-cy="orderButton"]';
const modalOverlay = '[data-cy="modalOverlay"]';
const orderNumber = '[data-cy="orderNumber"]';
describe('Интеграционные тесты конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'mockIngredients'
    );
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as(
      'mockOrder'
    );
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as(
      'mockUser'
    );

    cy.setCookie('accessToken', 'TEST_ACCESS_TOKEN');
    localStorage.setItem('refreshToken', 'TEST_REFRESH_TOKEN');

    cy.visit(testUrl);
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Добавление ингредиентов в конструктор', () => {
    beforeEach(() => {
      cy.wait('@mockIngredients');
    });

    it('Добавление булок в конструктор', () => {
      cy.get(bun).contains('Добавить').click();
      cy.get(burgerConstructor).should('contain', 'Краторная булка N-200i');
    });

    it('Добавление основных ингредиентов в конструктор', () => {
      cy.get(main).contains('Добавить').click();
      cy.get(burgerConstructor).should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );
    });
  });

  describe('Модальные окна ингредиентов', () => {
    beforeEach(() => {
      // Убедиться, что модальное окно закрыто перед открытием
      cy.get(modal).should('not.exist');
    });

    it('должен открывать модальное окно с правильной информацией при клике на булку', () => {
      cy.get(bun).first().click();
      cy.get(modal).should('be.visible');
      cy.get(modal).should('contain', 'Краторная булка N-200i'); // Проверка, что в модальном окне информация о булке
    });

    it('должен открывать модальное окно с правильной информацией при клике на основной ингредиент', () => {
      cy.get(main).first().click();
      cy.get(modal).should('be.visible');
      cy.get(modal).should('contain', 'Биокотлета из марсианской Магнолии'); // Проверка, что в модальном окне информация о котлете
    });

    it('должен закрывать модальное окно по клику на кнопку', () => {
      cy.get(bun).first().click();
      cy.get(closeModalButton).click();
      cy.get(modal).should('not.exist');
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      cy.get(bun).first().click();
      cy.get(modalOverlay).click({ force: true });
      cy.get(modal).should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('должен оформлять заказ и проверять модальное окно', () => {
      cy.get(bun).first().contains('Добавить').click();
      cy.get(main).first().contains('Добавить').click();
      cy.get(orderButton).click();

      cy.get(modal).should('be.visible');
      cy.get(orderNumber).should('contain', '101');

      cy.get(closeModalButton).click();
      cy.get(modal).should('not.exist');

      // Проверка, что конструктор очищен полностью
      cy.get(burgerConstructor).should('contain', 'Выберите булки');
      cy.get(burgerConstructor).should('contain', 'Выберите начинку');
      cy.get(burgerConstructor).should('not.contain', 'Краторная булка N-200i');
      cy.get(burgerConstructor).should(
        'not.contain',
        'Биокотлета из марсианской Магнолии'
      );
    });
  });
});
