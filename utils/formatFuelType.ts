import { FuelType } from "@prisma/client";

export default function formatFuelType(fuelType: FuelType): string {
  switch (fuelType) {
    case FuelType.gas:
      return "Gasolina";
    case FuelType.diesel:
      return "Diésel";
    case FuelType.electricity:
      return "Eléctrico";
    case FuelType.hybrid:
      return "Híbrido";
    default:
      return "Desconocido";
  }
}
