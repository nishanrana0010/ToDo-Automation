describe("Dashboard", () => {
  const validUsername = Cypress.env("validEmail");
  const validPassword = Cypress.env("validPassword");

  beforeEach(() => {
    cy.Sessionlogin(validUsername, validPassword);
    cy.visit("#action=150&cids=&menu_id=107");
  });

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
  });

  it("Verify that empty list cannot be created.", () => {
    cy.get(".list-name-section").within(() => {
      cy.get(".create-list-btn").contains("Create New list").click();
    });
    cy.get("#listModal").within(() => {
      cy.get('button[type="submit"]').click();
    });
    cy.get(".o_technical_modal").within(() => {
      cy.get(".o_dialog_warning").contains("Null value");
    });
  });

  it("Verify that users can create a new list on filling valid details in [new list] form", () => {
    cy.get(".list-title").within(() => {
      cy.get(".create-list-btn").click();
    });
    cy.get("#listModal").within(() => {
      cy.get('input[name="name"]').type("ACE List");
      cy.get('button[type="submit"]').click();
    });
  });

  it("Verify that users can edit list on clicking the [edit] button", () => {
    cy.get(".list-names")
      .find(".accordion-item")
      .first()
      .find(".accordion-header")
      .click()
      .within(() => {
        cy.get(".dots-div").click();
        cy.get("#menuItemsList > ul").children().first().find(".btn").click();
      });
    cy.get("#listModalEdit").within(() => {
      cy.get('input[name="name-edit"]').clear();
      cy.get('input[name="name-edit"]').type("Hello Updated");
      cy.get('button[type="submit"]').click();
    });
  });

  it("Verify that users can delete list on clicking the [delete] button ", () => {
    cy.get(":nth-child(1) > .accordion-header").within(() => {
      cy.get(".dots-div").click();
      cy.get("#menuItemsList")
        .children("ul")
        .children()
        .eq(1)
        .find(".btn")
        .click(); //changed
    });
    cy.get(".o_notification").within(() => {
      cy.get(".o_notification_content").should(
        "have.text",
        "List Deleted Successfully!!"
      );
    });
  });

  it("Verify that tasks can be created on filling the task form with valid credentials", () => {
    cy.get(".date-section").within(() => {
      cy.get(".create-task-btn").contains("Create New Task").click();
    });
    cy.get("#taskModal").within(() => {
      cy.get('input[name="task-name"]').type("New Task");
      cy.get("#select-list").select(1);
      cy.get("#select-priority").select(1);
      cy.get('input[name="datetime"]')
        .clear()
        .type("09/04/2023 5:00 PM")
        .click();
      cy.get('button[type="submit"]').click();
    });
  });

  it("Verify that the dashboard List view is functional", () => {
    cy.get(".list-section").within(() => {
      cy.get(".list-names")
        .children(".accordion-item")
        .first()
        .find(".accordion-header")
        .click();
      cy.get(".accordion-content")
        .should("have.prop", "nodeName", "DIV")
        .and("have.css", "display", "block");

      cy.get(".list-names .accordion-item")
        .eq(0)
        .find(".accordion-header")
        .click();
      cy.get(".accordion-content")
        .should("have.prop", "nodeName", "DIV")
        .and("have.css", "display", "none");
    });
  });

  it("Verify that task details can be edited on clicking the [edit] button.", () => {
    cy.get(".list-names")

      .find(".accordion-item")
      .first()
      .find(".accordion-header")
      .click();
    cy.get(".accordion-content")
      .children()
      .first()
      .within(() => {
        cy.get(".dots-div").click();
        cy.get("#menuItems > ul ")
          .children(":nth-child(1)")
          .find(".btn")
          .click();
      });

    cy.get("#taskEditModal").within(() => {
      cy.get("#task-edit-name").clear().type("Updated Task");
      cy.get("#select-edit-list").select(1);
      cy.get("#select-edit-priority").select(2);
      cy.get('input[name="datetime"]')
        .clear()
        .type("07/19/2024 5:00 PM")
        .click();
      cy.get('button[type="submit"]').click();
    });
  });

  it("Verify that task details can be deleted.", () => {
    cy.get(".list-names").within(() => {
      cy.get(":nth-child(1) > .accordion-header").click();
      cy.get(".accordion-content > :nth-child(1)").within(() => {
        cy.get(".dots-div").click();
        cy.get("#menuItems > ul ")
          .children(":nth-child(2)")
          .find(".btn")
          .click();
      });
    });
    cy.get(".o_notification").within(() => {
      cy.get(".o_notification_content").should(
        "have.text",
        "Task Deleted Successfully!!"
      );
    });
  });

  it("verify that the Today's Task is functional", () => {
    cy.get(".today-task").click();
    cy.get(".task-heading").should("have.text", "Today Tasks");
  });
  it("verify that the Upcoming Task is functional", () => {
    cy.get(".upcoming-task").click();
    cy.get(".task-heading").should("have.text", "Upcoming Tasks");
  });
  it("verify that the Overdue Task is functional", () => {
    cy.get(".overdue-task").click();
    cy.get(".task-heading").should("have.text", "Overdue Tasks");
  });

  it("Todays task count", () => {
    cy.get(".today-task h1")
      .invoke("text")
      .then((initialCount) => {
        const initialTaskCount = parseInt(initialCount);

        cy.contains("Create New Task").click();

        cy.get('input[id="task-name"]').type("New Date Task");
        cy.get("#select-list").select(2);
        cy.get('select[id="select-priority"]').select(1);
        cy.get('input[id="date_time"]').type("07/22/2024 3:00 PM");
        cy.get(
          "#datetimepicker > .input-group-append > .input-group-text > .fa"
        ).click();

        cy.get('button[type="submit"]').contains("Add Task").click();

        cy.get(".today-task h1")
          .invoke("text")
          .should((newCount) => {
            const newTaskCount = parseInt(newCount);
            expect(newTaskCount).to.equal(initialTaskCount + 1);
          });
      });
  });

  it("Upcoming task count", () => {
    cy.get(".upcoming-task h1")
      .invoke("text")
      .then((initialCount) => {
        const initialTaskCount = parseInt(initialCount);

        cy.contains("Create New Task").click();

        cy.get('input[id="task-name"]').type("Upcoming Date Task");
        cy.get("#select-list").select(2);
        cy.get('select[id="select-priority"]').select(2);
        cy.get('input[id="date_time"]')
          .clear()
          .type("08/22/2024 4:08 AM {enter}");
        cy.get(
          "#datetimepicker > .input-group-append > .input-group-text > .fa"
        ).click();

        cy.get('button[type="submit"]').contains("Add Task").click();

        cy.get(".upcoming-task h1")
          .invoke("text")
          .should((newCount) => {
            const newTaskCount = parseInt(newCount);
            expect(newTaskCount + 1).to.equal(initialTaskCount + 1);
          });
      });
  });

  it.only("Overdue task count", () => {
    cy.get(".overdue-task h1")
      .invoke("text")
      .then((initialCount) => {
        const initialTaskCount = parseInt(initialCount);

        cy.contains("Create New Task").click();

        cy.get('input[id="task-name"]').clear().type("Overdue Date Task");
        cy.get("#select-list").select(2);
        cy.get('select[id="select-priority"]').select(1);
        cy.get('input[id="date_time"]').clear().type("06/22/2024 3:00 PM");
        cy.get(
          "#datetimepicker > .input-group-append > .input-group-text > .fa"
        ).click();

        cy.get('button[type="submit"]').contains("Add Task").click();

        cy.get(".overdue-task h1")
          .invoke("text")
          .should((newCount) => {
            const newTaskCount = parseInt(newCount);
            expect(newTaskCount).to.equal(initialTaskCount + 1);
          });
      });
  });
});
