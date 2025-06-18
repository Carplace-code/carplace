export default function formatNumber(value: number, options: { useThousandsSeparator?: boolean } = {}): string {
  if (typeof value !== "number") throw new TypeError("Value must be a number or Decimal instance");

  const { useThousandsSeparator } = options;
  const stringValue = value.toString();
  return useThousandsSeparator ? stringValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : stringValue;
}
