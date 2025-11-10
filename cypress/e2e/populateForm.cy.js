describe('Populate Form and URL tests', () => {
  it('should populate form based on data in query parameters', () => {
    const queryParams = '?existing=0&price=12&currency=%24&unit=GJ&efficiency=80&electricity_price=0.12&seer2=14&heatPumpSEER2=17&heatPumpSEER2Unit=SEER2&heatPump=9&heatPumpUnit=HSPF&fuelUsed=272&heatLoss=10&heatLossUnit=kWh&city=Ottawa&heatPumpCost=14000&otherCost=7000';
    cy.visit('/' + queryParams);
    cy.location('search').should('eq', queryParams);

    cy.get('#existing').should('have.value', '0');
    cy.get('#existing').find('option:selected').should('have.text', 'Natural Gas');
    cy.get('#price').should('have.value', '12');
    cy.get('#currency').should('have.value', '$');
    cy.get('#unit').should('have.value', 'GJ');
    cy.get('#unit').find('option:selected').should('have.text', 'GJ');
    cy.get('#efficiency').should('have.value', '80');
    cy.get('#electricity_price').should('have.value', '0.12');
    cy.get('#seer2').should('have.value', '14');
    cy.get('#heatPumpSEER2').should('have.value', '17');
    cy.get('#heatPumpSEER2Unit').should('have.value', 'SEER2');
    cy.get('#heatPump').should('have.value', '9');
    cy.get('#heatPumpUnit').should('have.value', 'HSPF');
    cy.get('#fuelUsed').should('have.value', '272');
    cy.get('#heatLoss').should('have.value', '10');
    cy.get('#heatLossUnit').should('have.value', 'kWh');
    cy.get('#city').should('have.value', 'Ottawa');
    cy.get('#heatPumpCost').should('have.value', '14000');
    cy.get('#otherCost').should('have.value', '7000');
  });

  it('should hide price per unit of fuel when existing is electricity and set in query params', () => {
    cy.visit('/?existing=3');
    
    cy.get('#existing').should('have.value', '3');
    cy.get('#price').should('not.be.visible');
    cy.get('#currency').should('not.be.visible');
    cy.get('#unit').should('not.be.visible');
  });

  it('should go back normally', () => {
    cy.visit('/');
    cy.visit('/?existing=0&price=12&currency=%24&unit=GJ&efficiency=80&electricity_price=0.12&seer2=14&heatPumpSEER2=17&heatPumpSEER2Unit=SEER2&heatPump=9&heatPumpUnit=HSPF&fuelUsed=272&heatLoss=10&heatLossUnit=kWh&city=Ottawa&heatPumpCost=14000&otherCost=7000');
    cy.go('back');
    cy.location('pathname').should('eq', '/');
  });
});
