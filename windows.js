"use strict";

function preFillForm(){
  document.getElementById("heating").value = "4";
  document.getElementById("priceElectricity").value = "0.12";
  document.getElementById("heatPump").value = "8";
  document.getElementById("heatPumpUnit").value = "HSPF";
  document.getElementById("cooling").value = "17";
  document.getElementById("oldWindows").value = "2";
  document.getElementById("oldWindowsUnit").value = "R";
  document.getElementById("newWindows").value = "6.6";
  document.getElementById("newWindowsUnit").value = "R";
  document.getElementById("windowArea").value = "240";
  document.getElementById("windowAreaUnit").value = "ft2";
  document.getElementById("city").value = "Ottawa";
  document.getElementById("windowsCost").value = "40000";

  setHeating();
  calculate();
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
  preFillForm();
}
document.addEventListener('DOMContentLoaded', onLoad, false);

// Sources
// https://www.eia.gov/energyexplained/units-and-calculators/
const kWhPerUnit = {
  // Natural Gas
  "m3": 10.55,
  "ft3": 0.3045008,
  "therm": 29.307107,
  // Propane
  "L": 7.08,
  "gal": 26.801936,
  // Oil
  "oil_L": 10.35,
  "oil_gal": 40.6460267,
  // Electric Resistance
  "kWh": 1,
}


function hideAllChildren(element){
  for (let i = 0; i < element.children.length; i++) {
    element.children[i].style.display = "none";
  }
}

function displayIds(ids){
  for (const id of ids){
    document.getElementById(id).style.display = "block";
  }
}

function setHeating(){
  let existingHeat = document.getElementById("heating").value;
  let unitSelect = document.getElementById("priceEnergyUnit");

  unitSelect.value = "";

  hideAllChildren(unitSelect);
  let heatingPrice = document.getElementById("heatingPrice");
  let furnace = document.getElementById("furnace");
  if (existingHeat === "0"){ // Natural Gas
    let emptyOption = document.getElementById("emptyOption");
    emptyOption.style.display = "block";

    displayIds(["m3", "therm", "ft3"]);

    heatingPrice.style.display = "flex";
    furnace.style.display = "block";
  }
  else if (existingHeat === "1" || existingHeat === "2"){
    displayIds(["L", "gal"]);

    heatingPrice.style.display = "flex";
    furnace.style.display = "block";
  }
  else if (existingHeat === "3" || existingHeat === "4"){
    heatingPrice.style.display = "none";
    furnace.style.display = "none";
  }
}


function getTemperatureData(city){
  for (const cityData of temperatureDataSet){
    if (cityData[1] === city){
      return cityData;
    }
  }
}

const hoursPerMonth = {
  0: 31*24,
  1: 28*24,
  2: 31*24,
  3: 30*24,
  4: 31*24,
  5: 30*24,
  6: 31*24,
  7: 31*24,
  8: 30*24,
  9: 31*24,
  10: 30*24,
  11: 31*24,
}

function populateTemperatureTable(temperatureData, area, beforeHeatCoefficient, afterHeatCoefficient, costPerkWh){
  // The first two items are country and city
  const startIndex = 2;
  // We don't care about the last two elements
  const endIndex = temperatureData.length - 2;

  const roomTemperature = 20;
  const stopHeatingTemp = 15;
  const coolingTemp = 20;
  let temperatureDifference_C;
  let energyDifference_Wh;
  let monthySavings = 0;
  let yearlySavings = 0;
  let monthNum = -1;
  for(let i=startIndex;i<endIndex;i++){
    monthNum = monthNum + 1;
    temperatureDifference_C = 0;
    monthySavings = 0;
    // Populate table
    document.getElementById("m_" + (i - startIndex)).innerText = temperatureData[i];
    if (temperatureData[i] <= stopHeatingTemp){
      temperatureDifference_C = roomTemperature - temperatureData[i];
      document.getElementById("md_" + (i - startIndex)).innerText = temperatureDifference_C.toFixed(1);
    }
    else if (temperatureData[i] > coolingTemp){
      temperatureDifference_C = temperatureData[i] - roomTemperature;
      document.getElementById("md_" + (i - startIndex)).innerText = temperatureDifference_C.toFixed(1);
    }
    if(temperatureDifference_C !== 0){
      energyDifference_Wh = ((beforeHeatCoefficient*area)*temperatureDifference_C)-((afterHeatCoefficient*area)*temperatureDifference_C);
      monthySavings = ((energyDifference_Wh * hoursPerMonth[monthNum]) / 1000) * costPerkWh;
      document.getElementById("mh_" + (i - startIndex)).innerText = `$ ${monthySavings.toFixed(1)}`;
      yearlySavings += monthySavings;
    }
  }
  return yearlySavings;
}


function calculate(){
  let priceEnergy = Number(document.getElementById("priceEnergy").value);
  let priceEnergyUnit = document.getElementById("priceEnergyUnit").value;
  let efficiency = Number(document.getElementById("efficiency").value);
  let priceElectricity = Number(document.getElementById("priceElectricity").value);

  let efficiencyAsDecimal;
  let realkWhPerUnit;
  let costPerkWhHeat;
  let heating = document.getElementById("heating").value;
  if (heating === "4"){ // Heat pump
    let heatPumpSpec = document.getElementById("heatPump").value;
    let heatPumpSpecUnit = document.getElementById("heatPumpUnit").value;
    if(!heatPumpSpecUnit){
      return;
    }
    let hpCOP = heatPumpSpec;
    if (heatPumpSpecUnit === "HSPF"){
      hpCOP = hpCOP / 3.41;
    }

    priceEnergyUnit = "kWh";
    priceEnergy = priceElectricity;
    efficiencyAsDecimal = hpCOP;
    realkWhPerUnit = kWhPerUnit[priceEnergyUnit] * efficiencyAsDecimal;
    costPerkWhHeat = priceEnergy / realkWhPerUnit;
  }
  else if (heating === "3"){ // Electric Resistance
    priceEnergyUnit = "kWh";
    efficiencyAsDecimal = 1;
    priceEnergy = priceElectricity;
    realkWhPerUnit = kWhPerUnit[priceEnergyUnit] * efficiencyAsDecimal;
    costPerkWhHeat = price / realkWhPerUnit;
  }
  else if (priceEnergy && priceEnergyUnit && efficiency){
    if (priceEnergyUnit == "L" && heating === "2"){
      priceEnergyUnit = "oil_L";
    }
    else if(priceEnergyUnit == "gal" && heating == "2"){
      priceEnergyUnit = "oil_gal";
    }
    efficiencyAsDecimal = efficiency * 0.01;
    realkWhPerUnit = kWhPerUnit[priceEnergyUnit] * efficiencyAsDecimal;
    costPerkWhHeat = priceEnergy / realkWhPerUnit;
  }
  else {
    return;
  }

  // TODO: use cooling

  let oldWindows = document.getElementById("oldWindows").value;
  let oldWindowsUnit = document.getElementById("oldWindowsUnit").value;

  if (oldWindowsUnit === "R"){
    let u_imperial = 1 / oldWindows;
    oldWindows = u_imperial * 5.678;
  }
  else if (oldWindowsUnit === "U_imperial"){
    oldWindows = oldWindows * 5.678;
  }

  let newWindows = document.getElementById("newWindows").value;
  let newWindowsUnit = document.getElementById("newWindowsUnit").value;

  if (newWindowsUnit === "R"){
    let u_imperial = 1 / newWindows;
    newWindows = u_imperial * 5.678;
  }
  else if (newWindowsUnit === "U_imperial"){
    newWindows = newWindows * 5.678;
  }

  let windowArea = document.getElementById("windowArea").value;
  let windowAreaUnit = document.getElementById("windowAreaUnit").value;
  if (windowAreaUnit === "ft2"){
    windowArea = windowArea / 10.764;
  }

  let yearlyDifference = 0;
  let city = document.getElementById("city").value;
  if(!city){
    return;
  }
  let temperatureData = getTemperatureData(city);
  yearlyDifference = populateTemperatureTable(temperatureData, windowArea, oldWindows, newWindows, costPerkWhHeat);

  document.getElementById("yearlyDifference").innerText = yearlyDifference.toFixed(0);
  
  let windowsCost = document.getElementById("windowsCost").value;
  let breakEvenYear = windowsCost / yearlyDifference;
  document.getElementById("breakEvenYear").innerText = breakEvenYear.toFixed(2);
}
