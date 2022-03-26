"use strict";


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

  let cop = electricity_price / costPerkWhHeat;

  document.getElementById("cop").innerText = cop.toFixed(2);
}
