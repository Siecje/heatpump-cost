describe('The Home Page', () => {
  it('should calculate COP and breakEvenYear for Electric Resistance', () => {
    cy.visit('/');
    cy.get('#electric').check();
    cy.get('#price').should('not.be.visible');
    cy.get('input[name="unit"]').should('not.be.visible');
    cy.get('#efficiency').should('not.be.visible');
    cy.get('#electricity_price').type("0.11");
    cy.get('#heatPump').type("9");
    cy.get('#HSPF').check();
    cy.get('#cop').should('have.text', '1.00');
    cy.get('#heatLossTab').click();
    cy.get('#heatLossTabContent').should('be.visible');
    cy.get('#heatLoss').type("40000");
    cy.get('#BTUh').check();
    cy.get('#hourlyDifference').should('have.text', '0.80');
    cy.get('#monthlyDifference').should('have.text', '577');
    cy.get('#city').type("Ottawa");
    cy.get('#heatPumpCost').type("20000");
    cy.get('#otherCost').type("0");
    cy.get('#breakEvenYear').should('have.text', '4.62');
  });

  it('should calculate COP and breakEvenYear for Natural Gas', () => {
    cy.visit('/');
    cy.get('#natural_gas').check();
    cy.get('#price').type("1.27");
    cy.get('#therm').check();
    cy.get('#efficiency').type("80");
    cy.get('#electricity_price').type("0.15");
    cy.get('#heatPump').type("9");
    cy.get('#HSPF').check();
    cy.get('#cop').should('have.text', '2.77');
    cy.get('#heatLossTab').click();
    cy.get('#heatLossTabContent').should('be.visible');
    cy.get('#heatLoss').type("24000");
    cy.get('#BTUh').check();
    cy.get('#city').type("Edmonton");
    cy.get('#heatPumpCost').type("20000");
    cy.get('#otherCost').type("1500");
    cy.get('#breakEvenParagraph').should('not.be.visible');
  });

  it('should calculate COP and breakEvenYear for Natural Gas using monthly_cost', () => {
    // Same values as above except montly_cost is provided
    cy.visit('/');
    cy.get('#natural_gas').check();
    cy.get('#price').type("$1.27");
    cy.get('#therm').check();
    cy.get('#monthly_cost').type('20');
    cy.get('#efficiency').type("80");
    cy.get('#electricity_price').type("$0.15");
    cy.get('#heatPump').type("9");
    cy.get('#HSPF').check();
    cy.get('#cop').should('have.text', '2.77');
    cy.get('#heatLossTab').click();
    cy.get('#heatLossTabContent').should('be.visible');
    cy.get('#heatLoss').type("24000");
    cy.get('#BTUh').check();
    cy.get('#city').type("Edmonton");
    cy.get('#heatPumpCost').type("20000");
    cy.get('#otherCost').type("1500");
    cy.get('#hourlyDifference').should('have.text', '0.01');
    cy.get('#monthlyDifference').should('have.text', '7');
    cy.get('#yearlyDifference').should('have.text', '52');
    cy.get('#breakEvenParagraph')
      .should('be.visible')
      .should('contain', '355.76');
  });

  it('should calculate COP and breakEvenYear for Oil', () => {
    cy.visit('/');
    cy.get('#oil').check();
    cy.get('#price').type("2.35");
    cy.get('#L').check();
    cy.get('#efficiency').type("80");
    cy.get('#electricity_price').type("0.12");
    cy.get('#heatPump').type("9");
    cy.get('#HSPF').check();
    cy.get('#cop').should('have.text', '0.42');
    cy.get('#heatLossTab').click();
    cy.get('#heatLossTabContent').should('be.visible');
    cy.get('#heatLoss').type("24000");
    cy.get('#BTUh').check();
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
    cy.get('#propane').check();
    cy.get('#price').type("0.79");
    cy.get('#L').check();
    cy.get('#efficiency').type("95");
    cy.get('#electricity_price').type("0.11");
    cy.get('#heatPump').type("9");
    cy.get('#HSPF').check();
    cy.get('#cop').should('have.text', '0.94');
    cy.get('#fuelUsed').type("1660");
    cy.get('#heatPumpCost').type("20000");
    cy.get('#otherCost').type("0");
    cy.get('#breakEvenYear').should('have.text', '23.64');
  });

  it('should not have a break even if the heat pump costs more', () => {
    cy.visit('/');
    cy.get('#seasonalSavingsText').should('not.be.visible');
    cy.get('#seasonalSavingsTextMore').should('not.be.visible');
    cy.get('#natural_gas').check();
    cy.get('#price').type("1.27");
    cy.get('#therm').check();
    cy.get('#efficiency').type("80");
    cy.get('#electricity_price').type("0.15");
    cy.get('#heatPump').type("9");
    cy.get('#HSPF').check();
    cy.get('#fuelUsed').type("3000");
    cy.get('#heatPumpCost').type("20000");
    cy.get('#otherCost').type("0");
    cy.get('#currency').type('$');
    cy.get('#seasonalSavings')
      .should('be.visible')
      .invoke('text')
      .then(t => t.replace(/\s+/g, ' ').trim())
      .should('include', 'Every heating season with that heat pump will cost $187.49 MORE.')
    cy.get('#seasonalSavingsTextMore').should('be.visible');
    cy.get('#seasonalSavingsAmount').should('be.visible');
    cy.get('#breakEvenParagraph').should('not.be.visible');
    cy.get('#currency').clear().type('€');
    cy.get('#seasonalSavings')
      .should('be.visible')
      .invoke('text')
      .then(t => t.replace(/\s+/g, ' ').trim())
      .should('include', 'Every heating season with that heat pump will cost 187.49€ MORE.')
    cy.get('#seasonalSavingsTextMore').should('be.visible');
    cy.get('#seasonalSavingsAmount').should('be.visible');
  });

  it('should remove MORE from seasonalSavings', () => {
    cy.visit('/');
    cy.get('#seasonalSavingsText').should('not.be.visible');
    cy.get('#seasonalSavingsTextMore').should('not.be.visible');
    cy.get('#natural_gas').check();
    cy.get('#price').type("1.27");
    cy.get('#therm').check();
    cy.get('#efficiency').type("80");
    cy.get('#electricity_price').type("0.15");
    cy.get('#heatPump').type("9");
    cy.get('#HSPF').check();
    cy.get('#fuelUsed').type("3000");
    cy.get('#heatPumpCost').type("20000");
    cy.get('#otherCost').type("0");
    cy.get('#currency').type('$');
    cy.get('#seasonalSavings').should('be.visible');
    cy.get('#seasonalSavingsTextMore').should('be.visible');
    cy.get('#price').clear().type("1.5");
    cy.get('#seasonalSavingsTextMore').should('not.be.visible');
    cy.get('#seasonalSavings').should('be.visible');
  });
  
  it('should show cooling savings SEER', () => {
    cy.visit('/');
    cy.get('#seer2').type("14");
    cy.get('#heatPumpSEER2').type("17");
    cy.get('#SEER2').check();
    cy.get('#acCostMultiplier').should('have.text', '18% LESS.');
  });

  it('should show cooling savings COP', () => {
    cy.visit('/');
    cy.get('#seer2').type("14");
    cy.get('#heatPumpSEER2').type("4.98");
    cy.get('#copCool').check();
    cy.get('#acCostMultiplier').should('have.text', '18% LESS.');
  });

  it('should support GJ unit', () => {
    cy.visit('/');
    // Select natural gas
    cy.get('#natural_gas').check();

    cy.get('input[name="unit"][value="GJ"]').should('be.visible');
    cy.get('#GJ').check();
    cy.get('#price').type("12.04");

    cy.get('#efficiency').type("80");
    cy.get('#electricity_price').type("0.15");
    cy.get('#heatPump').type("9");
    cy.get('#HSPF').check();
    cy.get('#cop').should('have.text', '2.77');
    cy.get('#heatLossTab').click();
    cy.get('#heatLossTabContent').should('be.visible');
    cy.get('#heatLoss').type("24000");
    cy.get('#BTUh').check();
    cy.get('#city').type("Edmonton");
    cy.get('#heatPumpCost').type("20000");
    cy.get('#otherCost').type("1500");
    cy.get('#breakEvenParagraph').should('not.be.visible');
  });

  it('should populate average temperature table when city is known', () => {
    cy.visit('/');
    cy.get('#heatLossTab').click();
    
    cy.get('#city').should('be.visible');
    cy.get('#city').type("Edmonton");
    const cellIds = [
      '#m_0',
      '#m_1',
      '#m_2',
      '#m_3',
      '#m_4',
      '#m_5',
      '#m_6',
      '#m_7',
      '#m_8',
      '#m_9',
      '#m_10',
      '#m_11'
    ];

    cellIds.forEach((cellId) => {
      cy.get(cellId).invoke('text').then((text) => {
        const num = parseFloat(text);
        expect(isFinite(num) && !isNaN(num)).to.be.true;
      });
    });
  });

  it('should populate average temperature table when city is known from URL', () => {
    cy.visit('/?city=Ottawa');
    cy.get('#heatLossTab').click();
    
    cy.get('#city').should('be.visible');
    const cellIds = [
      '#m_0',
      '#m_1',
      '#m_2',
      '#m_3',
      '#m_4',
      '#m_5',
      '#m_6',
      '#m_7',
      '#m_8',
      '#m_9',
      '#m_10',
      '#m_11'
    ];

    cellIds.forEach((cellId) => {
      cy.get(cellId).invoke('text').then((text) => {
        const num = parseFloat(text);
        expect(isFinite(num) && !isNaN(num)).to.be.true;
      });
    });
  });

  it('should unselect invalid unit after changing heathing method', () => {
    cy.visit('/');

    cy.get('#natural_gas').check();
    cy.get('input[name="unit"]')
      .filter(':visible')
      .should('have.length', 4).each(($el) => {
        cy.wrap($el).should('not.be.checked');
      });
    cy.get('#therm').check();
    cy.get('#propane').check();
    
    // therm is not checked and not visible
    cy.get('#therm').should('exist').and('not.be.visible').and('not.be.checked');

    // no other radio button is selected
    cy.get('input[name="unit"]')
      .filter(':visible')
      .should('have.length', 3).each(($el) => {
        cy.wrap($el).should('not.be.checked');
      });
  });
});
