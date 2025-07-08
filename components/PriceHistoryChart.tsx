/* eslint-disable */

"use client";

import { format, parseISO, subMonths, subWeeks, subYears } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";

interface PriceHistoryChartProps {
  currentPrice: number;
  listings: any[];
}

type DateRange = "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL";

export default function PriceHistoryChart({ currentPrice, listings }: PriceHistoryChartProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange>("3M");

  // Función para obtener la fecha de inicio según el rango seleccionado
  const getStartDate = (range: DateRange): Date => {
    const today = new Date();

    switch (range) {
      case "1W":
        return subWeeks(today, 1);
      case "1M":
        return subMonths(today, 1);
      case "3M":
        return subMonths(today, 3);
      case "6M":
        return subMonths(today, 6);
      case "1Y":
        return subYears(today, 1);
      case "ALL":
        // Encontrar la fecha más antigua en los datos reales
        const allDates = listings.flatMap(
          (listing) => listing.priceHistory?.map((ph: any) => new Date(ph.recordedAt)) || [],
        );
        return allDates.length > 0 ? new Date(Math.min(...allDates.map((d) => d.getTime()))) : subYears(today, 1);
      default:
        return subMonths(today, 3);
    }
  };

  // Función para obtener el precio mínimo actual de los listings disponibles
  const getCurrentMinPrice = (listingsData: any[]): number => {
    const today = new Date();

    // Filtrar listings disponibles hoy (soldAt es null o fecha futura)
    const availableListings = listingsData.filter((listing) => {
      const soldDate = listing.soldAt ? new Date(listing.soldAt) : null;
      return !soldDate || soldDate > today;
    });

    if (availableListings.length === 0) return currentPrice;

    const currentPrices = [];

    availableListings.forEach((listing) => {
      // Obtener el precio más reciente del listing
      const validPriceHistory = listing.priceHistory?.filter((ph: any) => new Date(ph.recordedAt) <= today) || [];

      if (validPriceHistory.length > 0) {
        const sortedHistory = validPriceHistory.sort(
          (a: any, b: any) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
        );
        // Convertir precio de string a number
        const price = Number.parseInt(sortedHistory[0].price, 10);
        if (!isNaN(price)) {
          currentPrices.push(price);
        }
      } else {
        // Si no hay historial, usar el precio actual del listing
        const price = Number.parseInt(listing.price, 10);
        if (!isNaN(price)) {
          currentPrices.push(price);
        }
      }
    });

    return currentPrices.length > 0 ? Math.min(...currentPrices) : currentPrice;
  };

  // Procesar datos considerando fechas de venta de listings y rango seleccionado
  const processDataWithAvailability = (listingsData: any[], dateRange: DateRange) => {
    if (!listingsData || listingsData.length === 0) return [];

    const startDate = getStartDate(dateRange);
    const endDate = new Date();

    console.log(
      `🔍 Procesando ${listingsData.length} listings desde ${startDate.toISOString().split("T")[0]} hasta ${endDate.toISOString().split("T")[0]}`,
    );

    const processedData = [];

    // Determinar intervalo según el rango
    let intervalDays = 1;
    switch (dateRange) {
      case "1W":
        intervalDays = 1; // Diario
        break;
      case "1M":
        intervalDays = 2; // Cada 2 días
        break;
      case "3M":
        intervalDays = 7; // Semanal
        break;
      case "6M":
        intervalDays = 14; // Cada 2 semanas
        break;
      case "1Y":
      case "ALL":
        intervalDays = 30; // Mensual
        break;
    }

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];

      // Para cada fecha, obtener listings disponibles y sus precios más recientes
      const availableListings = listingsData.filter((listing) => {
        const soldDate = listing.soldAt ? new Date(listing.soldAt) : null;
        return !soldDate || soldDate > currentDate;
      });

      if (availableListings.length > 0) {
        const prices = [];

        availableListings.forEach((listing) => {
          // Obtener el precio más reciente del listing hasta esta fecha
          const validPriceHistory =
            listing.priceHistory?.filter((ph: any) => new Date(ph.recordedAt) <= currentDate) || [];

          let latestPrice = null;

          if (validPriceHistory.length > 0) {
            // Ordenar por fecha y tomar el más reciente
            const sortedHistory = validPriceHistory.sort(
              (a: any, b: any) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
            );
            latestPrice = Number.parseInt(sortedHistory[0].price, 10);
          } else {
            // Si no hay historial para esta fecha, usar el precio actual del listing si fue publicado antes
            const publishedDate = listing.publishedAt ? new Date(listing.publishedAt) : null;
            if (publishedDate && publishedDate <= currentDate) {
              latestPrice = Number.parseInt(listing.price, 10);
            }
          }

          if (latestPrice && !isNaN(latestPrice)) {
            prices.push({
              listingId: listing.id,
              title: listing.title,
              price: latestPrice,
            });
          }
        });

        if (prices.length > 0) {
          const priceValues = prices.map((p) => p.price);
          const minPrice = Math.min(...priceValues);

          processedData.push({
            date: dateStr,
            minPrice,
            availableListings: prices.length,
            availablePrices: prices,
          });
        }
      }

      // Avanzar según el intervalo
      currentDate.setDate(currentDate.getDate() + intervalDays);
    }

    // ASEGURAR QUE SIEMPRE HAY UN PUNTO PARA HOY
    const todayStr = endDate.toISOString().split("T")[0];
    const hasToday = processedData.some((data) => data.date === todayStr);

    if (!hasToday) {
      console.log("🎯 Agregando punto para hoy:", todayStr);

      // Obtener el precio mínimo actual
      const todayMinPrice = getCurrentMinPrice(listingsData);

      // Obtener listings disponibles hoy
      const availableListings = listingsData.filter((listing) => {
        const soldDate = listing.soldAt ? new Date(listing.soldAt) : null;
        return !soldDate || soldDate > endDate;
      });

      const todayPrices = [];
      availableListings.forEach((listing) => {
        const validPriceHistory = listing.priceHistory?.filter((ph: any) => new Date(ph.recordedAt) <= endDate) || [];

        let latestPrice = null;

        if (validPriceHistory.length > 0) {
          const sortedHistory = validPriceHistory.sort(
            (a: any, b: any) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
          );
          latestPrice = Number.parseInt(sortedHistory[0].price, 10);
        } else {
          latestPrice = Number.parseInt(listing.price, 10);
        }

        if (latestPrice && !isNaN(latestPrice)) {
          todayPrices.push({
            listingId: listing.id,
            title: listing.title,
            price: latestPrice,
          });
        }
      });

      if (todayPrices.length > 0) {
        processedData.push({
          date: todayStr,
          minPrice: todayMinPrice,
          availableListings: todayPrices.length,
          availablePrices: todayPrices,
        });
      }
    }

    // Ordenar por fecha para asegurar orden correcto
    processedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    console.log("✅ Datos procesados:", processedData.length, "puntos");
    console.log("🎯 Último punto:", processedData[processedData.length - 1]?.date);

    return processedData;
  };

  // Usar datos reales en lugar de mock
  const dataToUse = listings || [];
  const rawData = processDataWithAvailability(dataToUse, selectedRange);

  const chartData = rawData.map((data) => ({
    date: data.date,
    minPrice: data.minPrice,
    availableListings: data.availableListings,
    availablePrices: data.availablePrices,
  }));

  // Calcular rango de precios
  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-6">
          <h3 className="mb-2 text-xl font-bold text-slate-900">Historial de Precios</h3>
          <p className="text-sm text-slate-600">
            No hay suficiente historial de precios disponible para mostrar el gráfico.
          </p>
        </div>
        <div className="flex h-40 items-center justify-center rounded-lg bg-slate-50">
          <p className="text-slate-500">Datos insuficientes para mostrar el gráfico</p>
        </div>
      </div>
    );
  }

  const allPrices = chartData.map((d) => d.minPrice);
  const minChartPrice = Math.min(...allPrices);
  const maxChartPrice = Math.max(...allPrices);
  const priceRange = maxChartPrice - minChartPrice;
  const padding = Math.max(priceRange * 0.1, 500000);

  const finalMinPrice = Math.min(minChartPrice, currentPrice) - padding;
  const finalMaxPrice = Math.max(maxChartPrice, currentPrice) + padding;

  const formatPrice = (value: number) => `$${(value / 1000000).toFixed(1)}M`;

  const formatDate = (dateStr: string) => {
    try {
      // Formato diferente según el rango
      switch (selectedRange) {
        case "1W":
        case "1M":
          return format(parseISO(dateStr), "dd MMM", { locale: es });
        case "3M":
        case "6M":
          return format(parseISO(dateStr), "MMM dd", { locale: es });
        case "1Y":
        case "ALL":
          return format(parseISO(dateStr), "MMM yyyy", { locale: es });
        default:
          return format(parseISO(dateStr), "MMM dd", { locale: es });
      }
    } catch {
      return dateStr;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isToday = data.date === new Date().toISOString().split("T")[0];

      return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
          <p className="font-medium text-slate-900">
            {format(parseISO(label), "dd 'de' MMMM, yyyy", { locale: es })}
            {isToday && <span className="ml-2 rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">HOY</span>}
          </p>
          <p className="text-sm text-slate-600">
            Precio mínimo disponible:{" "}
            <span className="font-semibold text-green-600">CLP ${data.minPrice?.toLocaleString()}</span>
          </p>
          <p className="text-xs text-slate-500">
            {data.availableListings} {data.availableListings === 1 ? "listing disponible" : "listings disponibles"}
          </p>
          {data.availablePrices && data.availablePrices.length > 0 && (
            <div className="mt-1 text-xs text-slate-400">
              Listings:{" "}
              {data.availablePrices
                .slice(0, 3)
                .map((p: any) => `$${(p.price / 1000000).toFixed(1)}M`)
                .join(", ")}
              {data.availablePrices.length > 3 && ` +${data.availablePrices.length - 3} más`}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const dateRangeOptions = [
    { value: "1W" as DateRange, label: "1 Semana" },
    { value: "1M" as DateRange, label: "1 Mes" },
    { value: "3M" as DateRange, label: "3 Meses" },
    { value: "6M" as DateRange, label: "6 Meses" },
    { value: "1Y" as DateRange, label: "1 Año" },
    { value: "ALL" as DateRange, label: "Todo" },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">Historial de Precios</h3>
            <p className="text-sm text-slate-600">
              Precio más bajo disponible. Datos hasta {format(new Date(), "dd 'de' MMMM, yyyy", { locale: es })}.
            </p>
          </div>

          {/* Controles de rango de fechas */}
          <div className="flex gap-1">
            {dateRangeOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedRange === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRange(option.value)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Info de debugging */}
        <div className="mt-2 rounded bg-gray-50 p-2 text-xs text-gray-600">
          <p>
            🔍 Rango: {selectedRange} | {chartData.length} puntos | {dataToUse.length} listings | Precio actual: CLP $
            {currentPrice.toLocaleString()}
          </p>
          <p>
            📅 Desde: {getStartDate(selectedRange).toISOString().split("T")[0]} hasta:{" "}
            {new Date().toISOString().split("T")[0]}
          </p>
          <p>
            🎯 Último punto: {chartData[chartData.length - 1]?.date} | Min actual: CLP $
            {getCurrentMinPrice(dataToUse).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="relative h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke="#64748b" fontSize={12} />
            <YAxis tickFormatter={formatPrice} stroke="#64748b" fontSize={12} domain={[finalMinPrice, finalMaxPrice]} />
            <Tooltip content={<CustomTooltip />} />

            {/* Línea de precio mínimo - CON stepAfter para líneas horizontales */}
            <Line
              type="stepAfter"
              dataKey="minPrice"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "#fff" }}
            />

            {/* Línea de referencia para el precio actual */}
            <ReferenceLine
              y={currentPrice}
              stroke="#3b82f6"
              strokeWidth={3}
              strokeDasharray="8 4"
              label={{
                value: `Precio Actual: $${(currentPrice / 1000000).toFixed(1)}M`,
                position: "topRight",
                fill: "#3b82f6",
                fontSize: 12,
                fontWeight: "bold",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex items-center justify-center gap-6 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-xs text-slate-600">Precio más bajo disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1 w-6 border-2 border-dashed border-blue-500" />
          <span className="text-xs text-slate-600">Precio actual</span>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
        <div className="text-center">
          <div className="text-lg font-bold text-slate-900">
            CLP ${Math.min(...chartData.map((d) => d.minPrice)).toLocaleString()}
          </div>
          <div className="text-xs text-slate-600">Precio más bajo en el período</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-slate-900">
            CLP ${Math.max(...chartData.map((d) => d.minPrice)).toLocaleString()}
          </div>
          <div className="text-xs text-slate-600">Precio más alto en el período</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">CLP ${currentPrice.toLocaleString()}</div>
          <div className="text-xs text-slate-600">Precio actual</div>
        </div>
      </div>

      {/* Información de listings */}
      <div className="mt-6 border-t border-slate-100 pt-4">
        <h4 className="mb-3 font-semibold text-slate-900">Listings Actuales ({dataToUse.length}):</h4>
        <div className="grid max-h-32 grid-cols-1 gap-2 overflow-y-auto text-xs">
          {dataToUse.slice(0, 10).map((listing) => (
            <div key={listing.id} className="flex justify-between rounded bg-slate-50 p-2">
              <span className="truncate font-medium">{listing.title}</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-600">CLP ${Number.parseInt(listing.price).toLocaleString()}</span>
                <span className={listing.soldAt ? "text-red-600" : "text-green-600"}>
                  {listing.soldAt ? "Vendido" : "Disponible"}
                </span>
              </div>
            </div>
          ))}
          {dataToUse.length > 10 && (
            <div className="py-1 text-center text-slate-500">+{dataToUse.length - 10} listings más</div>
          )}
        </div>
      </div>
    </div>
  );
}
