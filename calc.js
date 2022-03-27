"use strict";

function preFillForm(){
  document.getElementById("existing").value = "1";
  document.getElementById("price").value = "0.79";
  document.getElementById("unit").value = "L";
  document.getElementById("efficiency").value = "95";
  document.getElementById("electricity_price").value = "0.12";
  document.getElementById("heatLoss").value = "22515";
  document.getElementById("heatLossUnit").value = "BTUh";
  // document.getElementById("city").value = "Ottawa";
  document.getElementById("heatPump").value = "9";
  document.getElementById("heatPumpUnit").value = "HSPF";
  document.getElementById("heatPumpCost").value = "20000";
  calculateCOP();
}


function addCitySuggestions(){
  let datalist = document.getElementById("cityOptions");
  for (const cityData of temperatureDataSet){
    let option = document.createElement("option");
    option.setAttribute("value", cityData[1]);
    datalist.appendChild(option);
  }
}


function onLoad(){
  // addCitySuggestions();
  // preFillForm();
}
document.addEventListener('DOMContentLoaded', onLoad, false);


const kWhPerUnit = {
  // Natural Gas
  "m3": 10.55,
  "therm": 29.307107,
  // Propane
  "L": 7.08,
}


function hideAllChildren(element){
  for (let i = 0; i < element.children.length; i++) {
    element.children[i].style.display = "none";
  }
}


function setExisting(){
  let existingHeat = document.getElementById("existing").value;
  let unitSelect = document.getElementById("unit");

  hideAllChildren(unitSelect);
  if (existingHeat === "0"){
    let emptyOption = document.getElementById("emptyOption");
    emptyOption.style.display = "block";

    let m3 = document.getElementById("m3");
    m3.style.display = "block";

    let therm = document.getElementById("therm");
    therm.style.display = "block";

    let existingPrice = document.getElementById("existingPrice");
    existingPrice.style.display = "flex";

    let existingFurnace = document.getElementById("existingFurnace");
    existingFurnace.style.display = "block";
  }
  else if (existingHeat === "1" || existingHeat === "2"){
    let litre = document.getElementById("L");
    litre.style.display = "block";

    let existingPrice = document.getElementById("existingPrice");
    existingPrice.style.display = "flex";

    let existingFurnace = document.getElementById("existingFurnace");
    existingFurnace.style.display = "block";
  }
  else if (existingHeat === "3"){
    let existingPrice = document.getElementById("existingPrice");
    existingPrice.style.display = "none";

    let existingFurnace = document.getElementById("existingFurnace");
    existingFurnace.style.display = "none";
  }
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

  let eqCOP = electricity_price / costPerkWhHeat;
  document.getElementById("cop").innerText = eqCOP.toFixed(2);

  let heatPumpSpec = document.getElementById("heatPump").value;
  let heatPumpSpecUnit = document.getElementById("heatPumpUnit").value;
  let hpCOP = heatPumpSpec;
  if (heatPumpSpecUnit === "HSPF"){
    hpCOP = hpCOP / 3.41;
  }
  
  let ratio = hpCOP / eqCOP;
  let text = "";
  if(hpCOP > eqCOP){
    text = ratio.toFixed(2) + " times LESS."
  }
  else if(hpCOP < eqCOP){
    text = ratio.toFixed(2) + " times MORE."
  }
  else {
    text = " the same."
  }
  document.getElementById("costMultiplier").innerText = text;

  let energyPerHour = document.getElementById("heatLoss").value;
  let energyPerHourUnit = document.getElementById("heatLossUnit").value;
  if (energyPerHourUnit === "BTUh"){
    energyPerHour = energyPerHour / 3412;
  }
  let otherCostPerHour = (energyPerHour / realkWhPerUnit) * costPerkWhHeat;
  let hpCostPerHour = energyPerHour * electricity_price;
  let hourlyDifference;
  if(otherCostPerHour > hpCostPerHour){
    hourlyDifference = otherCostPerHour - hpCostPerHour;
  }
  else {
    hourlyDifference = hpCostPerHour - otherCostPerHour;
  }
  let monthlyDifference = hourlyDifference * 24 * 30;
  let yearlyDifference = hourlyDifference * 24 * 365;
  document.getElementById("hourlyDifference").innerText = hourlyDifference.toFixed(2);
  document.getElementById("monthlyDifference").innerText = monthlyDifference.toFixed(0);
  document.getElementById("yearlyDifference").innerText = yearlyDifference.toFixed(0);

  let heatPumpCost = document.getElementById("heatPumpCost").value;
  let breakEvenYear = heatPumpCost / yearlyDifference;
  document.getElementById("breakEvenYear").innerText = breakEvenYear.toFixed(2);
}
