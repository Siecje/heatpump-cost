describe('Currency Tests', () => {
  it('set existing currency will disable electricity currency', () => {
    cy.visit('/');
    
    // Set existing unit currency
    cy.get('#currency').type("$");
    
    cy.get('#currency2')
        .should('have.value', '$')
        // Should disable editing in electricity currency
        .and('have.attr', 'readonly');

    // Clear existing unit currency
    cy.get('#currency').type('{selectall}{backspace}');

    cy.get('#currency2').should('not.have.attr', 'readonly');
  });

  it('should set currency when currency2 is set', () => {
    cy.visit('/');
    
    // Set electricity unit currency
    cy.get('#currency2').type("$");

    cy.get('#currency').should('have.value', '$');

    // Both are editable
    cy.get('#currency').should('not.have.attr', 'readonly');
    cy.get('#currency').should('not.have.attr', 'readonly');
  });

  it('should set currency symbol before amount', () => {
    cy.visit('/');
    
    cy.get('#currency').type("$");

    cy.get('[data-currency').should('have.text', ' ($)');
    
    // Fill out data to display savings amounts
    cy.get('#existing').select("0");
    cy.get('#price').type("12.04");
    cy.get('#unit').select("GJ");

    cy.get('#efficiency').type("80");
    cy.get('#electricity_price').type("0.12");
    cy.get('#heatPump').type("9");
    cy.get('#heatPumpUnit').select("HSPF");
    cy.get('#heatLossTab').click();
    cy.get('#heatLossTabContent').should('be.visible');
    cy.get('#heatLoss').type("35000");
    cy.get('#heatLossUnit').select("BTUh");
    cy.get('#city').type("Edmonton");

    // Ensure currency symbol is before amount
    cy.get('#hourlyDifference').parent().invoke('text').should('include', '$0.09');
    cy.get('#monthlyDifference').parent().invoke('text').should('include', '$64');
    cy.get('#yearlyDifference').parent().invoke('text').should('include', '$515');
  });

  it('should set currency symbol after amount', () => {
    cy.visit('/');

    cy.get('#currency').type("€");

    cy.get('[data-currency').should('have.text', ' (€)');

    // Fill out data to display savings amounts
    cy.get('#existing').select("0");
    cy.get('#price').type("12.04");
    cy.get('#unit').select("GJ");

    cy.get('#efficiency').type("80");
    cy.get('#electricity_price').type("0.12");
    cy.get('#heatPump').type("9");
    cy.get('#heatPumpUnit').select("HSPF");
    cy.get('#heatLossTab').click();
    cy.get('#heatLossTabContent').should('be.visible');
    cy.get('#heatLoss').type("35000");
    cy.get('#heatLossUnit').select("BTUh");
    cy.get('#city').type("Edmonton");

    // Ensure currency symbol is after amount
    cy.get('#hourlyDifference').parent().invoke('text').should('include', '0.09€');
    cy.get('#monthlyDifference').parent().invoke('text').should('include', '64€');
    cy.get('#yearlyDifference').parent().invoke('text').should('include', '515€');
  });

  it('should set currency symbol after amount with cents', () => {
    cy.visit('/');

    cy.get('#existing').select("3");
    cy.get('#electricity_price').type("12");
    cy.get('#currency2').type("¢");
    cy.get('[data-currency').should('have.text', ' (¢)');

    // Fill out data to display savings amounts
    cy.get('#heatPump').type("9");
    cy.get('#heatPumpUnit').select("HSPF");
    cy.get('#heatLossTab').click();
    cy.get('#heatLossTabContent').should('be.visible');
    cy.get('#heatLoss').type("35000");
    cy.get('#heatLossUnit').select("BTUh");
    cy.get('#city').type("Edmonton");

    // Ensure currency symbol is after amount
    cy.get('#hourlyDifference').parent().invoke('text').should('include', '76.46¢');
    cy.get('#monthlyDifference').parent().invoke('text').should('include', '55048¢');
    cy.get('#yearlyDifference').parent().invoke('text').should('include', '440385¢');
  });
});
