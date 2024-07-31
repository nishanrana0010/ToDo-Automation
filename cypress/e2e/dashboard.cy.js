describe("Dashboard", () => {
  let urls;
  let dashboard;
  const validUsername = Cypress.env("validEmail");
  const validPassword = Cypress.env("validPassword");
  before(() => {
    cy.fixture("urls.json").then((data) => {
      urls = data;
    });
    cy.fixture("dashboard.json").then((data) => {
      dashboard = data;
    });
  });

  beforeEach(() => {
    cy.Sessionlogin(validUsername, validPassword);
    cy.visit(urls.DashboardUrl);
  });

  it("Verify that list cannot be created on leaving the mandatory fields empty", () => {
    cy.get('div[class="list-title"]').within(() => {
      cy.get(".create-list-btn").contains("Create New list").click();
    });
    cy.get('div[id="listModal"]').within(() => {
      cy.get('button[type="submit"]').click();
    });
    cy.get(".o_technical_modal").within(() => {
      cy.get(".o_dialog_warning").contains(dashboard.Null);
    });
  });

  it("Verify that users can create a new list on filling valid details in [new list] form", () => {
    cy.get('div[class="list-title"]').within(() => {
      cy.get(".create-list-btn").contains("Create New list").click();
    });
    cy.get('div[id="listModal"]').within(() => {
      cy.get('input[name="name"]').type(dashboard.ListName);
      cy.get('button[type="submit"]').click();
    });
    cy.get('div[class="list-section"]').within(() => {
      cy.get('div[class="list-names"]').should(
        "contain.text",
        dashboard.ListName
      );
    });
  });

  it("Verify that users can edit list on clicking the [edit] button", () => {
    cy.get('div[class="list-names"]')
      .find('div[class="accordion-item"]')
      .first()
      .find('div[class="accordion-header"]')
      .click()
      .within(() => {
        cy.get('div[class="dots-div"]').click();
        cy.get('div[id="menuItemsList"]').within(() => {
          cy.get(".edit-list-btn").click();
        });
      });

    cy.get('div[id="listModalEdit"]').within(() => {
      cy.get('input[name="name-edit"]').clear();
      cy.get('input[name="name-edit"]').type(dashboard.EditList);
      cy.get('button[type="submit"]').click();
    });
    cy.get('div[class="o_notification_manager"]')
      .find('div[class="o_notification_content"]')
      .should("have.text", dashboard.ListUpdateMessage);
    cy.get('div[class="list-names"]').within(() => {
      cy.get("h3").contains(dashboard.EditList).should("be.visible");
    });
  });

  it("Verify that users can delete list on clicking the [delete] button ", () => {
    cy.get('div[class="list-section"]').within(() => {
      cy.get(".list-names")
        .find(".accordion-header", dashboard.ListName)
        .eq(1)
        .within(() => {
          cy.get('div[class="dots-div"]').click();
          cy.get('div[id="menuItemsList"]').within(() => {
            cy.get('button[class="btn btn-primary delete-list-btn"]').click();
          });
        });
    });
    cy.get('div[class="o_notification_manager"]')
      .find('div[class="o_notification_content"]')
      .should("have.text", dashboard.ListDeleteMessage);
    cy.get('div[class="list-section"]').within(() => {
      cy.get('div[class="list-names"]').should(
        "not.contain",
        dashboard.ListName
      );
    });
  });

  it("Verify that tasks can be created on filling the [task] form with valid credentials", () => {
    cy.get('div[class="date-section"]').within(() => {
      cy.get('button[class="btn btn-primary create-task-btn"]')
        .contains("Create New Task")
        .click();
    });
    cy.get('div[id="taskModal"]').within(() => {
      cy.get('input[name="task-name"]').type(dashboard.TaskName);
      cy.get("#select-list").select(1);
      cy.get("#select-priority").select(1);
      cy.get('input[name="datetime"]')
        .clear()
        .type(dashboard.TodayDate)
        .click();
      cy.get('button[type="submit"]').click();
    });
    cy.get('div[class="list-section"]').within(() => {
      cy.get('div[class="list-names"]').should(
        "contain.text",
        dashboard.TaskName
      );
    });
  });

  it("Verify that the dashboard List view gets expanded/collapsed on clicking the down and up arrow", () => {
    cy.get('div[class="list-section"]').within(() => {
      cy.get('div[class="list-names"]')
        .children('div[class="accordion-item"]')
        .first()
        .find('div[class="accordion-header"]')
        .click();
      cy.get('div[class="accordion-content"]')
        .should("have.prop", "nodeName", "DIV")
        .and("have.css", "display", "block");

      cy.get('div[class="accordion-item"]')
        .eq(0)
        .find('div[class="accordion-header active"]')
        .click();
      cy.get('div[class="accordion-content"]')
        .should("have.prop", "nodeName", "DIV")
        .and("have.css", "display", "none");
    });
  });

  it("Verify that task details can be edited on clicking the [edit] button.", () => {
    cy.get('div[class="list-names"]')

      .find('div[class="accordion-item"]')
      .first()
      .find('div[class="accordion-header"]')
      .click();
    cy.get('div[class="accordion-content"]')
      .children()
      .first()
      .within(() => {
        cy.get('div[class="dots-div"]').click();
        cy.get("#menuItems > ul ")
          .children(":nth-child(1)")
          .find(".btn")
          .click();
      });

    cy.get('div[id="taskEditModal"]').within(() => {
      cy.get('input[id="task-edit-name"]').clear().type(dashboard.UpdateTask);
      cy.get('select[id="select-edit-list"]').select(1);
      cy.get('select[id="select-edit-priority"]').select(2);
      cy.get('input[name="datetime"]')
        .clear()
        .type(dashboard.TodayDate)
        .click();
      cy.get('button[type="submit"]').click();
    });
    cy.get('div[class="list-section"]').within(() => {
      cy.get('div[class="list-names"]').should(
        "contain.text",
        dashboard.UpdateTask
      );
    });
  });

  it("Verify that task can be deleted on clicking the [delete] button", () => {
    cy.get('div[class="list-names"]').within(() => {
      cy.contains('div[class="accordion-header"]', "ACE List").click();
      cy.contains(
        'div[class="accordion-content"]',
        dashboard.UpdateTask
      ).within(() => {
        cy.get('div[class="dots-div"]').first().click();
        cy.get('div[id="menuItems"]')
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
        dashboard.TaskDeleteMessage
      );
    });
    cy.get('div[class="list-section"]').within(() => {
      cy.get('div[class="list-names"]').should(
        "not.contain",
        dashboard.TaskName
      );
    });
  });

  it("verify that [Today's task card] is functional", () => {
    cy.get('div[class="card today-task"]').click();
    cy.get('h3[class="task-heading"]').should("have.text", dashboard.TodayCard);
  });
  it("verify that the [Upcoming Task card] is functional", () => {
    cy.get('div[class="card upcoming-task"]').click();
    cy.get('h3[class="task-heading"]').should(
      "have.text",
      dashboard.UpcomingDate
    );
  });
  it("verify that the [Overdue Task card] is functional", () => {
    cy.get('div[class="card overdue-task"]').click();
    cy.get('h3[class="task-heading"]').should(
      "have.text",
      dashboard.OverdueCard
    );
  });

  it("Verify if [Today tasks] count gets updated on adding tasks", () => {
    cy.get(".today-task h1")
      .invoke("text")
      .then((initialCount) => {
        const initialTaskCount = parseInt(initialCount);

        cy.contains("Create New Task").click();

        cy.get('input[id="task-name"]').type(dashboard.NewTask);
        cy.get('select[id="select-list"]').select(2);
        cy.get('select[id="select-priority"]').select(1);
        cy.get('input[id="date_time"]').type(`${dashboard.TodayDate}{enter}`);
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

        cy.get('input[id="task-name"]').type(dashboard.UpcomingDate);
        cy.get('select[id="select-list"]').select(2);
        cy.get('select[id="select-priority"]').select(2);
        cy.get('input[id="date_time"]')
          .clear()
          .type(`${dashboard.UpcomingDate}{enter}`);
        cy.get('i[class="fa fa-calendar"]').first().click();

        cy.get('button[type="submit"]').contains("Add Task").click();

        cy.get(".upcoming-task h1")
          .invoke("text")
          .should((newCount) => {
            const newTaskCount = parseInt(newCount);
            expect(newTaskCount).to.equal(initialTaskCount + 1);
          });
      });
  });

  it("Verify if [Overdue tasks] count gets updated on adding tasks", () => {
    cy.get(".overdue-task h1")
      .invoke("text")
      .then((initialCount) => {
        const initialTaskCount = parseInt(initialCount);

        cy.contains("Create New Task").click();

        cy.get('input[id="task-name"]').clear().type(dashboard.OverdueTask);
        cy.get('select[id="select-list"]').select(1);
        cy.get('select[id="select-priority"]').select(1);
        cy.get('input[id="date_time"]')
          .clear()
          .type(`${dashboard.OverdueDate}{enter}`);
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
    cy.get('div[class="task-list"]').within(() => {
      cy.contains('div[class="form-check"]', "New2").within(() => {
        cy.get('button[class="button-task"]').click();
      });
    });
    cy.contains('div[class="task-list"]', "New2")
      .parent()
      .find('div[class="priority-box"]')
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

        cy.get('input[id="task-name"]').clear().type(dashboard.TaskName);
        cy.get('select[id="select-list"]').select(1);
        cy.get('select[id="select-priority"]').select(1);
        cy.get('input[id="date_time"]').clear().type(dashboard.TodayDate);
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
