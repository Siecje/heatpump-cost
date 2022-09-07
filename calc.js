"use strict";

function preFillForm(){
  document.getElementById("existing").value = "1";
  document.getElementById("price").value = "0.79";
  document.getElementById("unit").value = "L";
  document.getElementById("efficiency").value = "95";
  document.getElementById("electricity_price").value = "0.11";
  document.getElementById("fuelUsed").value = "1660";
  // document.getElementById("heatLoss").value = "22515";
  // document.getElementById("heatLossUnit").value = "BTUh";
  document.getElementById("city").value = "Ottawa";
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
  addCitySuggestions();
  // preFillForm();
}
document.addEventListener('DOMContentLoaded', onLoad, false);


const kWhPerUnit = {
  // Natural Gas
  "m3": 10.55,
  "therm": 29.307107,
  // Propane
  "L": 7.08,
  // Oil
  "gal": 40.6460267,
  "oil_L": 10.35,
  // Electric Resistance
  "kWh": 1,
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
    if (existingHeat === "2"){
      let gal = document.getElementById("gal");
      gal.style.display = "block";
    }

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


function getTemperatureData(city){
  for (const cityData of temperatureDataSet){
    if (cityData[1] === city){
      return cityData;
    }
  }
}


function getNumberOfHeatingMonths(temperatureData){
  let count = 0;
  // The first two items are country and city
  const startIndex = 2;
  // We don't care about the last two elements
  const endIndex = temperatureData.length - 2;

  // Temperature to stop heating
  let stopHeatingTemp = 15;
  let partialHeatingTemp = 10;
  for(let i=startIndex;i<endIndex;i++){
    // Populate table
    document.getElementById("m_" + (i - startIndex)).innerText = temperatureData[i];
    if (temperatureData[i] <= partialHeatingTemp){
      count += 1;
      document.getElementById("mh_" + (i - startIndex)).innerText = "*";
    }
    else if (temperatureData[i] <= stopHeatingTemp){
      count += 0.5;
      document.getElementById("mh_" + (i - startIndex)).innerText = "*";
    }
  }
  return count;
}


function calculateCOP(){
  let price = Number(document.getElementById("price").value);
  let unit = document.getElementById("unit").value;
  let efficiency = Number(document.getElementById("efficiency").value);
  let electricity_price = Number(document.getElementById("electricity_price").value);

  let efficiencyAsDecimal;
  let eqCOP;
  let realkWhPerUnit;
  let costPerkWhHeat;
  let existing = document.getElementById("existing").value;
  if (existing === "3"){ // Electric Resistance
    eqCOP = 1;
    unit = "kWh";
    efficiencyAsDecimal = 1;
    price = electricity_price;
    realkWhPerUnit = kWhPerUnit[unit] * efficiencyAsDecimal;
    costPerkWhHeat = price / realkWhPerUnit;
  }
  else if (price && unit && efficiency){
    if (unit == "L" && existing === "2"){
      unit = "oil_L";
    }
    efficiencyAsDecimal = efficiency * 0.01;
    realkWhPerUnit = kWhPerUnit[unit] * efficiencyAsDecimal;
    costPerkWhHeat = price / realkWhPerUnit;
    eqCOP = electricity_price / costPerkWhHeat;
  }
  else {
    return;
  }

  document.getElementById("cop").innerText = eqCOP.toFixed(2);

  let heatPumpSpec = document.getElementById("heatPump").value;
  let heatPumpSpecUnit = document.getElementById("heatPumpUnit").value;
  if(!heatPumpSpecUnit){
    return;
  }
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

  let yearlyDifference = 0;
  let fuelused = document.getElementById("fuelUsed").value;

  if (fuelused){
    let costHeatingSeasonExisting = fuelused * price;
    let heatNeeded_kWh = fuelused * kWhPerUnit[unit] * efficiencyAsDecimal;
    // reduce heatNeeded_kWh by COP then multiple by price
    let costHeatingSeasonHP = (heatNeeded_kWh / hpCOP) * electricity_price;
    let seasonalSavingsText = 'Every heating season that heat pump will ';
    if (costHeatingSeasonExisting > costHeatingSeasonHP) {
      yearlyDifference = costHeatingSeasonExisting - costHeatingSeasonHP;
      seasonalSavingsText += 'save $' + yearlyDifference.toFixed(2);
    }
    else if (costHeatingSeasonExisting < costHeatingSeasonHP){
      yearlyDifference = costHeatingSeasonHP - costHeatingSeasonExisting;
      seasonalSavingsText += 'cost $' + yearlyDifference.toFixed(2) + 'more.';
    }
    else {
      seasonalSavingsText += 'cost the same.';
    }
    document.getElementById("seasonalSavings").innerText = seasonalSavingsText;
  }
  else {
    let energyPerHour = document.getElementById("heatLoss").value;
    let energyPerHourUnit = document.getElementById("heatLossUnit").value;
    if (!energyPerHour || !energyPerHourUnit){
      return;
    }
    if (energyPerHourUnit === "BTUh"){
      energyPerHour = energyPerHour / 3412;
    }
    let otherCostPerHour = (energyPerHour / realkWhPerUnit) * costPerkWhHeat;
    let hpCostPerHour = (energyPerHour / ratio) * electricity_price;
    let hourlyDifference;
    if(otherCostPerHour > hpCostPerHour){
      hourlyDifference = otherCostPerHour - hpCostPerHour;
    }
    else {
      hourlyDifference = hpCostPerHour - otherCostPerHour;
    }
    document.getElementById("hourlyDifference").innerText = hourlyDifference.toFixed(2);
    let monthlyDifference = hourlyDifference * 24 * 30;
    document.getElementById("monthlyDifference").innerText = monthlyDifference.toFixed(0);

    let city = document.getElementById("city").value;
    if(!city){
      return;
    }
    let temperatureData = getTemperatureData(city);
    let numMonthsOfHeat = getNumberOfHeatingMonths(temperatureData);

    if (numMonthsOfHeat > 0){
      yearlyDifference = hourlyDifference * 24 * 30 * numMonthsOfHeat;
    }
  
    document.getElementById("numHeatingMonths").innerText = numMonthsOfHeat;
  }

  
  document.getElementById("yearlyDifference").innerText = yearlyDifference.toFixed(0);

  let heatPumpCost = document.getElementById("heatPumpCost").value;
  let otherCost = Number(document.getElementById("otherCost").value);
  if (Number.isInteger(otherCost)){
    heatPumpCost -= otherCost;
  }
  
  let breakEvenYear = heatPumpCost / yearlyDifference;
  document.getElementById("breakEvenYear").innerText = breakEvenYear.toFixed(2);
}
