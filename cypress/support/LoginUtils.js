export const login = (username, password) => {
  cy.visit("/login");

  if (username) {
    cy.get('input[type="text"]').type(username);
  }

  if (password) {
    cy.get('input[type="password"]').type(password);
  }

  cy.get('input[type="submit"]').click();

};
