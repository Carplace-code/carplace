/* eslint-disable */

export default function CarSpecs({ listing }: { listing: any }) {
  const { trim } = listing;
  const { version } = trim;
  const { model } = version;
  const { brand } = model;

  return (
    <div className="space-y-3 rounded-md border bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">Vehicle Specifications</h2>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <p>
          <strong>Brand/Model:</strong> {brand.name} {model.name}
        </p>
        <p>
          <strong>Color:</strong> {listing.exteriorColor}
        </p>
        <p>
          <strong>Year:</strong> {version.year}
        </p>
        <p>
          <strong>Engine:</strong> {trim.motorSize} cc
        </p>
        <p>
          <strong>Transmission:</strong> {trim.transmissionType}
        </p>
        <p>
          <strong>VIN:</strong> N/A
        </p>
        <p>
          <strong>Fuel Type:</strong> {trim.fuelType}
        </p>
      </div>
      <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700" type="button">
        Check Vehicle History
      </button>
    </div>
  );
}
