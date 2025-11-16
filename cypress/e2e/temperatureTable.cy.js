describe('Temperature Table tests', () => {
  it('should populate with both temperatures', () => {
    cy.visit('/');
    cy.get('#heatLossTab').click();
    
    cy.get(`[id^="m_"]`)
      .each(($cell, index) => {
        cy.wrap($cell).should('be.empty');
      });

    cy.get(`[id^="mf_"]`)
      .each(($cell) => {
        cy.wrap($cell).should('be.empty');
      });

    cy.get('#city').type('Ottawa');
    cy.get(`[id^="m_"]`)
      .each(($cell, index) => {
        cy.wrap($cell).should('not.be.empty');
      });

    cy.get(`[id^="mf_"]`)
      .each(($cell) => {
        cy.wrap($cell).should('not.be.empty');
      });
  });

  it('can remove both columns', () => {
    cy.visit('/');
    cy.get('#heatLossTab').click();
    cy.get('#city').type('Calgary');

    cy.get('#hide_C').click();
    cy.get(`[id^="m_"]`)
      .each(($cell, index) => {
        cy.wrap($cell).should('not.be.visible');
      });

    cy.get(`[id^="mf_"]`)
      .each(($cell) => {
        cy.wrap($cell).should('be.visible');
      });
    cy.get('#hide_C').parent().should('not.be.visible');
    
    cy.get('#hide_F').click();
    cy.get(`[id^="m_"]`)
      .each(($cell, index) => {
        cy.wrap($cell).should('not.be.visible');
      });

    cy.get(`[id^="mf_"]`)
      .each(($cell) => {
        cy.wrap($cell).should('not.be.visible');
      });
    cy.get('#hide_F').parent().should('not.be.visible');
  });

});
