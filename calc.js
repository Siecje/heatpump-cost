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
}


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

function setExisting(){
  let existingHeat = document.getElementById("existing").value;
  let unitSelect = document.getElementById("unit");

  unitSelect.value = "";

  hideAllChildren(unitSelect);
  if (existingHeat === "0"){ // Natural Gas
    let emptyOption = document.getElementById("emptyOption");
    emptyOption.style.display = "block";

    displayIds(["m3", "therm", "ft3"]);

    let existingPrice = document.getElementById("existingPrice");
    existingPrice.style.display = "flex";

    let existingFurnace = document.getElementById("existingFurnace");
    existingFurnace.style.display = "block";
  }
  else if (existingHeat === "1" || existingHeat === "2"){
    displayIds(["L", "gal"]);

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
  // Cooling
  let seer2 = document.getElementById("seer2").value;
  let heatPumpSEER2 = document.getElementById("heatPumpSEER2").value;
  let heatPumpSEER2Unit = document.getElementById("heatPumpSEER2Unit").value;

  let acCOP;
  let hpAcCOP;
  if (seer2 && heatPumpSEER2 && heatPumpSEER2Unit){
    // To convert SEER to COP, multiply by 0.293 or 1055/3600
    // SEER vs SEER2: SEER2 will just be lower (more correct)
    acCOP = seer2 * (1055/3600);
    if(heatPumpSEER2Unit === "SEER2"){
      hpAcCOP = heatPumpSEER2 * (1055/3600);
    }
    else if (heatPumpSEER2Unit === "COP"){
      hpAcCOP = heatPumpSEER2;
    }
    let acText = "";
    let acRatio = acCOP / hpAcCOP;
    if (hpAcCOP > acCOP) {
      acText = ((1 - acRatio) * 100).toFixed(0) + "% LESS";
    }
    else if(hpAcCOP < acCOP){
      acText = ((acRatio - 1) * 100).toFixed(0) + "% MORE";
    }
    else {
      acText = " the same";
    }
    document.getElementById("acCostMultiplier").innerText = acText;
  }

  let price = Number(document.getElementById("price").value.replaceAll("$", ""));
  let unit = document.getElementById("unit").value;
  let efficiency = Number(document.getElementById("efficiency").value);
  let electricity_price = Number(document.getElementById("electricity_price").value.replaceAll("$", ""));

  let efficiencyAsDecimal;
  let equivalentCOP;
  let realkWhPerUnit;
  let costPerkWhHeat;
  let existing = document.getElementById("existing").value;
  if (existing === "3"){ // Electric Resistance
    equivalentCOP = 1;
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
    else if(unit == "gal" && existing == "2"){
      unit = "oil_gal";
    }
    efficiencyAsDecimal = efficiency * 0.01;
    realkWhPerUnit = kWhPerUnit[unit] * efficiencyAsDecimal;
    costPerkWhHeat = price / realkWhPerUnit;
    equivalentCOP = electricity_price / costPerkWhHeat;
  }
  else {
    return;
  }

  document.getElementById("cop").innerText = equivalentCOP.toFixed(2);

  let heatPumpSpec = document.getElementById("heatPump").value;
  let heatPumpSpecUnit = document.getElementById("heatPumpUnit").value;
  if(!heatPumpSpecUnit){
    return;
  }
  let hpCOP = heatPumpSpec;
  if (heatPumpSpecUnit === "HSPF"){
    hpCOP = hpCOP / 3.41;
  }

  let ratio = equivalentCOP / hpCOP;
  let text = "";
  if(hpCOP > equivalentCOP){
    text = ((1 - ratio) * 100).toFixed(0) + "% LESS";
  }
  else if(hpCOP < equivalentCOP){
    text = ((ratio - 1) * 100).toFixed(0) + "% MORE";
  }
  else {
    text = " the same";
  }
  document.getElementById("costMultiplier").innerText = text;

  let yearlyDifference = 0;
  let fuelused = document.getElementById("fuelUsed").value;

  let costHeatingSeasonExisting = 0;
  let costHeatingSeasonHP = 0;
  if (fuelused){
    costHeatingSeasonExisting = fuelused * price;
    let heatNeeded_kWh = fuelused * kWhPerUnit[unit] * efficiencyAsDecimal;
    // reduce heatNeeded_kWh by COP then multiple by price
    costHeatingSeasonHP = (heatNeeded_kWh / hpCOP) * electricity_price;
    let seasonalSavingsText = 'Every heating season with that heat pump will ';
    if (costHeatingSeasonExisting > costHeatingSeasonHP) {
      yearlyDifference = costHeatingSeasonExisting - costHeatingSeasonHP;
      seasonalSavingsText += 'save $' + yearlyDifference.toFixed(2);
    }
    else if (costHeatingSeasonExisting < costHeatingSeasonHP){
      yearlyDifference = costHeatingSeasonHP - costHeatingSeasonExisting;
      seasonalSavingsText += 'cost $' + yearlyDifference.toFixed(2) + ' more.';
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
    let otherCostPerHour = energyPerHour * costPerkWhHeat;
    let hpCostPerHour = (energyPerHour / hpCOP) * electricity_price;
    let hourlyDifference;
    hourlyDifference = otherCostPerHour - hpCostPerHour;
    document.getElementById("hourlyDifference").innerText = hourlyDifference.toFixed(2);
    let monthlyDifference = hourlyDifference * 24 * 30;
    document.getElementById("monthlyDifference").innerText = monthlyDifference.toFixed(0);

    let city = document.getElementById("city").value;
    if(!city){
      return;
    }
    let temperatureData = getTemperatureData(city);
    if (temperatureData){
      let numMonthsOfHeat = getNumberOfHeatingMonths(temperatureData);
      document.getElementById("numHeatingMonths").innerText = numMonthsOfHeat;
      if (numMonthsOfHeat > 0){
        yearlyDifference = monthlyDifference * numMonthsOfHeat;
      }
    }
  }
  
  document.getElementById("yearlyDifference").innerText = yearlyDifference.toFixed(0);

  let heatPumpCost = document.getElementById("heatPumpCost").value;
  let otherCost = Number(document.getElementById("otherCost").value);
  if (Number.isInteger(otherCost)){
    heatPumpCost -= otherCost;
  }
  
  if ((!fuelused && yearlyDifference > 0)
      || costHeatingSeasonExisting > costHeatingSeasonHP){
    let breakEvenYear = heatPumpCost / yearlyDifference;
    document.getElementById("breakEvenYear").innerText = breakEvenYear.toFixed(2); 
    document.getElementById("breakEvenParagraph").style.visibility = "visible";
  }
  else {
    document.getElementById("breakEvenParagraph").style.visibility = "hidden";
  }
}

document.addEventListener('DOMContentLoaded', onLoad, false);
