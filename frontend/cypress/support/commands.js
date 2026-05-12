// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to select elements by data-testid
Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args);
});

// Custom command to select elements by data-testid that contains a string
Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-testid*=${selector}]`, ...args);
});
