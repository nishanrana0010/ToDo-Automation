import { login } from "../support/LoginUtils";

Cypress.Commands.add("login", login);

describe("TODO App", () => {
  let credentials, urls;
  const validEmail = Cypress.env("validEmail");
  const validPassword = Cypress.env("validPassword");
  before(() => {
    Cypress.on("uncaught:exception", (err) => {
      Cypress.log({
        name: "Uncaught Exception",
        message: err.message,
        consoleProps: () => ({
          error: err,
          message: err.message,
          stack: err.stack,
        }),
      });
      return false;
    });
    cy.fixture("datas.json").then((data) => {
      credentials = data;
    });

    cy.fixture("urls.json").then((data) => {
      urls = data;
    });
  });
  beforeEach(() => {
    cy.visit("/login");
  });

  it("Verify if validation message is displayed when required field are left empty.", () => {
    cy.login("", "").then(() => {
      cy.get('input[type="text"]').then(($input) => {
        expect($input[0].validationMessage).to.eq(
          "Please fill out this field."
        );
      });
    });
  });

  it("Verify if the [Show password] icon is functional ", () => {
    cy.get('form[role="form"]').within(() => {
      cy.get('input[name="password"]')
        .type("bajra")
        .should("have.prop", "nodeName", "INPUT")
        .and("have.attr", "type", "password");

      cy.get(".toggle-password").click();

      cy.get('input[name="password"]')
        .should("have.prop", "nodeName", "INPUT")
        .and("have.attr", "type", "text");

      cy.get('input[name="password"]').type("Hello");

      cy.get(".toggle-password").click();

      cy.get('input[type="password"]')
        .should("have.prop", "nodeName", "INPUT")
        .and("have.attr", "type", "password");
    });
  });

  it("Verify if users can to login with invalid credentials.", () => {
    cy.login(credentials.invalidEmail, credentials.invalidPassword).then(() => {
      cy.get('form[role="form"]').within(() => {
        cy.get('p[role="alert"]').should(
          "contain.text",
          "Wrong login/password"
        );
      });

      cy.get('input[type="text"]').clear();
      cy.get('input[type="password"]').clear();

      cy.login(validEmail, credentials.invalidPassword).then(() => {
        cy.get('form[role="form"]').within(() => {
          cy.get('p[role="alert"]').should(
            "contain.text",
            "Wrong login/password"
          );
        });
      });

      cy.get('input[type="text"]').clear();
      cy.get('input[type="password"]').clear();

      cy.login(credentials.invalidEmail, validPassword).then(() => {
        cy.get('p[role="alert"]').should(
          "contain.text",
          "Wrong login/password"
        );
      });
    });
  });

  it("Verify that on clicking forgot password link is clickable and redirects to forgot password page", () => {
    cy.get('form[role="form"]').within(() => {
      cy.get(".forgot-text")
        .contains("Forgot Password")
        .click();
    cy.url.should("include", urls.forgotPassword);
    });

  });

  it("Verify that on clicking create new account link is clickable and redirects to create new account page", () => {
    cy.get('form[role="form"]').within(() => {
      cy.get(".forgot-text")
        .contains("Create new account")
        .should("be.visible")
        .click();
    });
    cy.url("include", urls.signup);
  });

  it("Verify if  the users can login with valid credentials.", () => {
    cy.login(validEmail, validPassword);
    cy.url("include", "/web#action=150&cids=1&menu_id=107");
  });
});



