import { postData } from "../common/coomonMethods";

export async function getPointData(count) {
  const response = await fetch("point?count=" + count);
  return await response.json();
}

export async function calculateFuelConsumption(poinst) {
  const data = { Points: poinst };
  return await postData("point/CalculateFuelConsumption", data);
}
