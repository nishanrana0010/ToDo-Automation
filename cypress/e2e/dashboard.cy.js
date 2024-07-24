describe("Dashboard", () => {
  const validUsername = Cypress.env("validEmail");
  const validPassword = Cypress.env("validPassword");

  beforeEach(() => {
    cy.Sessionlogin(validUsername, validPassword);
    cy.visit("#action=150&cids=&menu_id=107");
  });

  it("Verify that list cannot be created on leaving the mandatory fields empty", () => {
    cy.get('div[class=".list-name-section"]').within(() => {
      cy.get(".create-list-btn").contains("Create New list").click();
    });
    cy.get('div[id="listModal"]').within(() => {
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
        cy.get("#menuItemsList > ul").children().eq(0).find(".btn").click();
      });
    cy.get("#listModalEdit").within(() => {
      cy.get('input[name="name-edit"]').clear();
      cy.get('input[name="name-edit"]').type("Hello Updated");
      cy.get('button[type="submit"]').click();
    });
  });

  it("Verify that users can delete list on clicking the [delete] button ", () => {
    cy.get(".list-names").within(() => {
      cy.contains(".accordion-header", "Hello Updated").click();
      cy.contains(".accordion-content", "hahhaha").within(() => {
        cy.get(".dots-div").click();
        cy.get("#menuItems")
          .children("ul")
          .children()
          .eq(1)
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

  it("Verify that tasks can be created on filling the [task] form with valid credentials", () => {
    cy.get(".date-section").within(() => {
      cy.get('div[class="create-task-btn"]')
        .contains("Create New Task")
        .click();
    });
    cy.get('div[id="taskModal"]').within(() => {
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

  it("Verify that the dashboard List view gets expanded/collapsed on clicking the down and up arrow", () => {
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
  //  it("Verify that the dashboard task view gets expanded/collapsed on clicking the down and up arrow", () => {
  //     cy.get('div[class="list-section"]').within(() => {
  //       cy.get(".list-names")
  //         .children(".accordion-item")
  //         .first()
  //         .find(".accordion-header")
  //         .click();
  //       cy.get(".accordion-content")
  //         .should("have.prop", "nodeName", "DIV")
  //         .and("have.css", "display", "block");

  //       cy.get(".list-names .accordion-item")
  //         .eq(0)
  //         .find(".accordion-header")
  //         .click();
  //       cy.get(".accordion-content")
  //         .should("have.prop", "nodeName", "DIV")
  //         .and("have.css", "display", "none");
  //     });
  //   });
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

  it("Verify that task details can be deleted on clicking the [delete] button", () => {
    cy.get(".list-names").within(() => {
      cy.contains(".accordion-header", "Hello Update").click();
      cy.contains(".accordion-content", "New Task").within(() => {
        cy.get('div[class="dots-div"]').first().click();
        cy.get("#menuItems")
          .children("ul")
          .children()
          .eq(1)
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

  it("verify that Today's task card is functional", () => {
    cy.get(".today-task").click();
    cy.get(".task-heading").should("have.text", "Today Tasks");
  });
  it("verify that the Upcoming Task card is functional", () => {
    cy.get(".upcoming-task").click();
    cy.get(".task-heading").should("have.text", "Upcoming Tasks");
  });
  it("verify that the Overdue Task card is functional", () => {
    cy.get(".overdue-task").click();
    cy.get(".task-heading").should("have.text", "Overdue Tasks");
  });

  it("Verify if [Today tasks] count gets updated on adding tasks", () => {
    cy.get(".today-task h1")
      .invoke("text")
      .then((initialCount) => {
        const initialTaskCount = parseInt(initialCount);

        cy.contains("Create New Task").click();

        cy.get('input[id="task-name"]').type("New Date Task");
        cy.get("#select-list").select(2);
        cy.get('select[id="select-priority"]').select(1);
        cy.get('input[id="date_time"]').type("07/22/2024 3:00 PM");
        cy.get('i[class="fa fa-calendar"]').first().click();
        cy.get('button[type="submit"]').contains("Add Task").click();

        cy.get(".today-task h1")
          .invoke("text")
          .should((newCount) => {
            const newTaskCount = parseInt(newCount);
            expect(newTaskCount).to.equal(initialTaskCount + 1);
          });
      });
  });

  it("Verify if [Upcoming tasks] count gets updated on adding tasks", () => {
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
        cy.get('i[class="fa fa-calendar"]').first().click();

        cy.get('button[type="submit"]').contains("Add Task").click();

        cy.get(".upcoming-task h1")
          .invoke("text")
          .should((newCount) => {
            const newTaskCount = parseInt(newCount);
            expect(newTaskCount + 1).to.equal(initialTaskCount + 1);
          });
      });
  });

  it("Verify if [Overdue tasks] count gets updated on adding tasks", () => {
    cy.get(".overdue-task h1")
      .invoke("text")
      .then((initialCount) => {
        const initialTaskCount = parseInt(initialCount);

        cy.contains("Create New Task").click();

        cy.get('input[id="task-name"]').clear().type("Overdue Date Task");
        cy.get("#select-list").select(2);
        cy.get('select[id="select-priority"]').select(1);
        cy.get('input[id="date_time"]').clear().type("06/22/2024 3:00 PM");
        cy.get('i[class="fa fa-calendar"]').first().click();

        cy.get('button[type="submit"]').contains("Add Task").click();

        cy.get(".overdue-task h1")
          .invoke("text")
          .should((newCount) => {
            const newTaskCount = parseInt(newCount);
            expect(newTaskCount).to.equal(initialTaskCount + 1);
          });
      });
  });

  it("Verify that tasks can be marked as completed.", () => {
    cy.get(".task-list").within(() => {
      cy.contains(".form-check", "New2").within(() => {
        cy.get(".button-task").click();
      });
    });
    cy.contains(".task-list", "New2")
      .parent()
      .find(".priority-box")
      .eq(0)
      .find("div.priority-completed")
      .should("exist");
  });

  it("Verify if  [tasks] count gets updated on adding tasks", () => {
    cy.get(".accordion-header p")
      .invoke("text")
      .then((initialCount) => {
        const initialTaskCount = parseInt(initialCount);

        cy.contains("Create New Task").click();

        cy.get('input[id="task-name"]').clear().type("Overdue Date Task");
        cy.get("#select-list").select(1);
        cy.get('select[id="select-priority"]').select(1);
        cy.get('input[id="date_time"]').clear().type("06/22/2024 3:00 PM");
        cy.get('i[class="fa fa-calendar"]').first().click();

        cy.get('button[type="submit"]').contains("Add Task").click();

        cy.get(".accordion-header p")
          .invoke("text")
          .should((newCount) => {
            const newTaskCount = parseInt(newCount);
            expect(newTaskCount).to.equal(initialTaskCount + 1);
          });
      });
  });
});
