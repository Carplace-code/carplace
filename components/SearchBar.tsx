/* eslint-disable */
"use client";

import { Input } from "@/components/ui/input";
import { useGetVersions } from "@/hooks/useVersions";
import type { Prisma } from "@prisma/client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type VersionWithModelBrand = Prisma.VersionGetPayload<{
  include: {
    model: {
      include: {
        brand: true
      }
    }
  }
}>;

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVersions, setFilteredVersions] = useState<VersionWithModelBrand[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const where = useMemo<Prisma.VersionWhereInput>(() => ({
    trims: {
      some: {
        carListings: {
          some: {},
        },
      },
    },
  }), []);

  const { data } = useGetVersions({
    where,
    include: {
      model: {
        include: {
          brand: true,
        },
      },
    },
    pageSize: 5000, // Fetch a larger set to allow for better search results
  });

  const versions = data?.data ?? [];

  useEffect(() => {
  if (!data?.data || !Array.isArray(versions)) return;

  if (!searchQuery.trim()) {
    setFilteredVersions([]);
    setShowResults(false);
    return;
  }

  const searchTerm = searchQuery.toLowerCase();

  const filtered = versions.filter((version) => {;
    const brand = version.model?.brand?.name ?? "";
    const model = version.model?.name ?? "";
    const year = version.year.toString();
    const fullLabel = `${brand} ${model} ${year}`.toLowerCase();
    return fullLabel.includes(searchTerm);
  });

  setFilteredVersions(filtered.slice(0, 8));
  setShowResults(true);
}, [searchQuery, versions]);

  const router = useRouter();

  const handleVersionSelect = (version: VersionWithModelBrand) => {
    // Redirect to version page details
    const brand = version.model?.brand?.name ?? "";
    const model = version.model?.name ?? "";
    const year = version.year.toString();
    const fullLabel = `${brand} ${model} ${year}`;
    setSearchQuery(fullLabel)
    setShowResults(false);
    router.push(`/versions/${version.id}`);
  }

  const handleInputFocus = () => {
    if (searchQuery.length > 0) {
      setShowResults(true);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setSearchQuery("");
      setShowResults(false);
      inputRef.current?.blur();
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className="container flex h-16 items-center px-4">
      <div className="flex-1 max-w-md mx-4 relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute top-2.5 right-3 h-4 w-4 text-gray-500" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Buscar por marca, modelo o año..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            className="w-80 pr-10"
          />
        </div>

        {showResults && (
          // eslint-disable-next-line max-len
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
            {filteredVersions.length === 0 && searchQuery.length > 0 ? (
              <div className="p-4 text-center text-muted-foreground">No se encontraron versiones.</div>
            ) : (
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Resultados de búsqueda</div>
                {filteredVersions.map((version) => {
                  const brand = version.model?.brand?.name ?? "";
                  const model = version.model?.name ?? "";
                  const year = version.year;
                  const label = `${brand} ${model} ${year}`;

                  return (
                    <div
                      key={version.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleVersionSelect(version)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleVersionSelect(version);
                        }
                      }}
                      // eslint-disable-next-line max-len
                      className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-accent rounded-md transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{label}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
