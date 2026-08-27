import {
  calculateTransportationEmission,
  calculateElectricityEmission,
  calculateFoodEmission,
  calculateWasteEmission,
  calculateWaterEmission,
} from "./carbonCalculator";

console.log(
  "Transportation:",
  calculateTransportationEmission({
    vehicle: "Car",
    fuel: "petrol",
    distance: 15,
  })
);

console.log(
  "Electricity:",
  calculateElectricityEmission(250)
);

console.log(
  "Food:",
  calculateFoodEmission({
    foodType: "Chicken",
    quantity: 1,
  })
);

console.log(
  "Waste:",
  calculateWasteEmission({
    wasteType: "Plastic",
    quantity: 2,
  })
);

console.log(
  "Water:",
  calculateWaterEmission(150)
);