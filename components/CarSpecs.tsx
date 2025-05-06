export default function CarSpecs() {
  return (
    <div className="space-y-3 rounded-md border bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">Vehicle Specifications</h2>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <p>
          <strong>Brand/Model:</strong> Mercedes-Benz C200
        </p>
        <p>
          <strong>Color:</strong> Silver
        </p>
        <p>
          <strong>Year:</strong> 2023
        </p>
        <p>
          <strong>Engine:</strong> 2.0L Turbo
        </p>
        <p>
          <strong>Transmission:</strong> Automatic
        </p>
        <p>
          <strong>VIN:</strong> WDD2040**********
        </p>
        <p>
          <strong>Fuel Type:</strong> Petrol
        </p>
      </div>
      <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700" type="button">
        Check Vehicle History
      </button>
    </div>
  );
}
