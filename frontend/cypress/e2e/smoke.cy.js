describe('Smoke Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the home page successfully', () => {
    // Basic check for title or major element
    cy.get('h1').should('be.visible');
    // Using custom command if data-testid is present
    // cy.getBySel('main-heading').should('contain', 'EShoppingZone');
  });

  it('should display the navigation bar', () => {
    cy.get('nav').should('be.visible');
  });
});
