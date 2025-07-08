import VersionCard, { type MinimumGridVersion } from "./VersionCard";

interface VersionsGridProps {
  versions: MinimumGridVersion[];
}

export default function VersionsGrid({ versions }: VersionsGridProps) {
  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <svg className="text-muted-foreground h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3 className="text-foreground mb-2 text-lg font-medium">No hay versiones disponibles</h3>
          <p className="text-muted-foreground text-sm">Intenta ajustar los filtros para encontrar más opciones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {versions.map((version) => (
        <VersionCard key={version.id} version={version} />
      ))}
    </div>
  );
}
