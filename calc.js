"use strict";


const kWhPerUnit = {
  // Natural Gas
  "m3": 10.55,
  "therm": 29.307107,
  // Propane
  "L": 7.08,
}


function calculateCOP(){
  let price = Number(document.getElementById("price").value);
  let unit = document.getElementById("unit").value;
  let efficiency = Number(document.getElementById("efficiency").value);
  let electricity_price = Number(document.getElementById("electricity_price").value);

  if (!price || !unit || !efficiency || !electricity_price){
    return;
  }

  let efficiencyAsDecimal = efficiency * 0.01;
  let realkWhPerUnit = kWhPerUnit[unit] * efficiencyAsDecimal;
  let costPerkWhHeat = price / realkWhPerUnit;

  let cop = electricity_price / costPerkWhHeat;

  document.getElementById("cop").innerText = cop.toFixed(2);
}
