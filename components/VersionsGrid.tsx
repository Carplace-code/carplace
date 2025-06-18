import VersionCard, { MinimumGridVersion } from "./VersionCard";

interface VersionsGridProps {
  versions: MinimumGridVersion[];
}

export default function VersionsGrid({ versions }: VersionsGridProps) {
  if (versions.length === 0) return <p className="py-6 text-center">No hay versiones disponibles</p>;

  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {versions.map((v) => (
        <VersionCard key={v.id} version={v} />
      ))}
    </div>
  );
}
