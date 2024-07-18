Cypress.Commands.add("login", (username, password) => {
  if (username) {
    cy.get('input[type="text"]').type(username);
  } else {
    cy.get('input[type="text"]');
  }

  if (password) {
    cy.get('input[type="password"]').type(password);
  } else {
    cy.get('input[type="password"]');
  }

  cy.get('input[type="submit"]').click();
});
