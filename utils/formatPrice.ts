export default function formatPrice(price: number | string): string {
  const localPrice = typeof price === "string" ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : price;
  return Number(localPrice).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}
