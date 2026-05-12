describe('Shopping Flow', () => {
  beforeEach(() => {
    cy.visit('/products');
  });

  it('should allow user to search for a product', () => {
    const searchTerm = 'electronics';
    cy.getBySel('search-input').type(`${searchTerm}{enter}`);
    
    // Check if URL contains search term (assuming it updates the URL or filters list)
    // For now, just check if loading finishes
    cy.get('.animate-pulse').should('not.exist');
  });

  it('should filter by category', () => {
    cy.getBySel('category-filter-electronics').click();
    cy.getBySel('category-filter-electronics').should('have.class', 'bg-primary-600');
  });

  it('should navigate to product detail page', () => {
    // Click on the first product card that appears
    cy.get('[data-testid^=product-card-]').first().click();
    cy.url().should('include', '/product/');
    cy.get('h1').should('be.visible');
  });

  it('should add a product to cart', () => {
    // Hover over the first product card to reveal the add to cart button
    // or just click the button if it's visible/accessible
    cy.get('[data-testid^=product-card-]').first().within(() => {
      // In this app, the button is revealed on hover, but Cypress can click hidden elements if needed
      // or we can trigger the hover state.
      cy.getBySel('add-to-cart-button').click({ force: true });
    });
    
    // Check for success toast
    cy.contains('added to cart').should('be.visible');
  });
});
