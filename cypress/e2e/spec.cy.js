describe('The Home Page', () => {
  it('should calculate COP and breakEvenYear for Electric Resistance', () => {
    cy.visit('/');
    cy.get('#existing').select("3");
    cy.get('#existing').find('option:selected').should('have.text', 'Electric Resistance');
    cy.get('#price').should('not.be.visible');
    cy.get('#unit').should('not.be.visible');
    cy.get('#efficiency').should('not.be.visible');
    cy.get('#electricity_price').type("0.11");
    cy.get('#heatPump').type("9");
    cy.get('#heatPumpUnit').select("HSPF");
    cy.get('#cop').should('have.text', '1.00');
    cy.get('#heatLossTab').click();
    cy.get('#heatLossTabContent').should('be.visible');
    cy.get('#heatLoss').type("40000");
    cy.get('#heatLossUnit').select("BTUh");
    cy.get('#hourlyDifference').should('have.text', '0.80');
    cy.get('#monthlyDifference').should('have.text', '577');
    cy.get('#city').type("Ottawa");
    cy.get('#heatPumpCost').type("20000");
    cy.get('#otherCost').type("0");
    cy.get('#breakEvenYear').should('have.text', '4.62');
  });

  it('should calculate COP and breakEvenYear for Natural Gas', () => {
    cy.visit('/');
    cy.get('#existing').select("0");
    cy.get('#existing').find('option:selected').should('have.text', 'Natural Gas');
    cy.get('#price').type("1.27");
    cy.get('#unit').select("therm");
    cy.get('#efficiency').type("80");
    cy.get('#electricity_price').type("0.15");
    cy.get('#heatPump').type("9");
    cy.get('#heatPumpUnit').select("HSPF");
    cy.get('#cop').should('have.text', '2.77');
    cy.get('#heatLossTab').click();
    cy.get('#heatLossTabContent').should('be.visible');
    cy.get('#heatLoss').type("24000");
    cy.get('#heatLossUnit').select("BTUh");
    cy.get('#city').type("Edmonton");
    cy.get('#heatPumpCost').type("20000");
    cy.get('#otherCost').type("1500");
    cy.get('#breakEvenParagraph').should('not.be.visible');
  });

  it('should calculate COP and breakEvenYear for Oil', () => {
    cy.visit('/');
    cy.get('#existing').select("2");
    cy.get('#existing').find('option:selected').should('have.text', 'Oil');
    cy.get('#price').type("2.35");
    cy.get('#unit').select("L");
    cy.get('#efficiency').type("80");
    cy.get('#electricity_price').type("0.12");
    cy.get('#heatPump').type("9");
    cy.get('#heatPumpUnit').select("HSPF");
    cy.get('#cop').should('have.text', '0.42');
    cy.get('#heatLossTab').click();
    cy.get('#heatLossTabContent').should('be.visible');
    cy.get('#heatLoss').type("24000");
    cy.get('#heatLossUnit').select("BTUh");
    cy.get('#hourlyDifference').should('have.text', '1.68');
    cy.get('#monthlyDifference').should('have.text', '1207');
    cy.get('#city').type("Edmonton");
    cy.get('#yearlyDifference').should('have.text', '9657');
    cy.get('#heatPumpCost').type("20000");
    cy.get('#otherCost').type("0");
    cy.get('#breakEvenYear').should('have.text', '2.07');
  });

  it('should calculate COP and breakEvenYear for Propane', () => {
    cy.visit('/');
    cy.get('#existing').select("1");
    cy.get('#price').type("0.79");
    cy.get('#unit').select("L");
    cy.get('#efficiency').type("95");
    cy.get('#electricity_price').type("0.11");
    cy.get('#heatPump').type("9");
    cy.get('#heatPumpUnit').select("HSPF");
    cy.get('#cop').should('have.text', '0.94');
    cy.get('#fuelUsed').type("1660");
    cy.get('#heatPumpCost').type("20000");
    cy.get('#otherCost').type("0");
    cy.get('#breakEvenYear').should('have.text', '23.64');
  });

  it('should not have a break even if the heat pump costs more', () => {
    cy.visit('/');
    cy.get('#existing').select("0");
    cy.get('#existing').find('option:selected').should('have.text', 'Natural Gas');
    cy.get('#price').type("1.27");
    cy.get('#unit').select("therm");
    cy.get('#efficiency').type("80");
    cy.get('#electricity_price').type("0.15");
    cy.get('#heatPump').type("9");
    cy.get('#heatPumpUnit').select("HSPF");
    cy.get('#fuelUsed').type("3000");
    cy.get('#heatPumpCost').type("20000");
    cy.get('#otherCost').type("0");
    cy.get('#breakEvenParagraph').should('not.be.visible');
  });

  it('should show cooling savings SEER', () => {
    cy.visit('/');
    cy.get('#seer2').type("14");
    cy.get('#heatPumpSEER2').type("17");
    cy.get('#heatPumpSEER2Unit').select("SEER2");
    cy.get('#acCostMultiplier').should('have.text', '18% LESS');
  });

  it('should show cooling savings COP', () => {
    cy.visit('/');
    cy.get('#seer2').type("14");
    cy.get('#heatPumpSEER2').type("4.98");
    cy.get('#heatPumpSEER2Unit').select("COP");
    cy.get('#acCostMultiplier').should('have.text', '18% LESS');
  });

  it('should support GJ unit', () => {
    cy.visit('/');
    // Select natural gas
    cy.get('#existing').select("0");
    cy.get('#existing').find('option:selected').should('have.text', 'Natural Gas');

    cy.get('#unit option[value="GJ"]').should('be.visible');
    cy.get('#unit').select("GJ");
    cy.get('#price').type("12.04");

    cy.get('#efficiency').type("80");
    cy.get('#electricity_price').type("0.15");
    cy.get('#heatPump').type("9");
    cy.get('#heatPumpUnit').select("HSPF");
    cy.get('#cop').should('have.text', '2.77');
    cy.get('#heatLossTab').click();
    cy.get('#heatLossTabContent').should('be.visible');
    cy.get('#heatLoss').type("24000");
    cy.get('#heatLossUnit').select("BTUh");
    cy.get('#city').type("Edmonton");
    cy.get('#heatPumpCost').type("20000");
    cy.get('#otherCost').type("1500");
    cy.get('#breakEvenParagraph').should('not.be.visible');
  });
});
