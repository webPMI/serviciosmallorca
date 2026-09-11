import { describe, it, expect } from "vitest";
import { OFFICIAL_STATISTICS } from "../../src/data/officialStats";
import { HISTORICAL_SECTOR_SERIES } from "../../src/data/historicalSectorStats";

describe("Exportación y Estructura Open Data (openDataExport)", () => {
  function escapeCsvCell(val: unknown): string {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  }

  function convertToCsv(data: Record<string, unknown>[]): string {
    if (data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const headerRow = headers.map(escapeCsvCell).join(",");
    const rows = data.map((row) => headers.map((header) => escapeCsvCell(row[header])).join(","));
    return "\uFEFF" + [headerRow, ...rows].join("\r\n");
  }

  it("debe generar un CSV válido con BOM UTF-8 y cabeceras completas para indicadores insulares", () => {
    const indicatorsData = OFFICIAL_STATISTICS.map((s) => ({
      id: s.id,
      categoria: s.category,
      titulo_es: s.title.es,
      valor: s.value,
      periodo: s.period,
      fuente_oficial: s.sourceEntity,
      codigo_serie: s.officialSeriesCode || "",
      alcance: s.dataScope,
    }));

    const csvOutput = convertToCsv(indicatorsData);

    // Debe comenzar con UTF-8 BOM para Excel
    expect(csvOutput.charCodeAt(0)).toBe(0xfeff);

    // Debe contener las cabeceras esperadas entrecomilladas según formato RFC
    expect(csvOutput).toContain('"id","categoria","titulo_es","valor","periodo","fuente_oficial","codigo_serie","alcance"');

    // Debe contener todas las 18 filas
    const lines = csvOutput.trim().split("\r\n");
    expect(lines.length).toBe(19); // 1 cabecera + 18 filas
  });

  it("escapa comillas y caracteres delimitadores según RFC 4180", () => {
    const testData = [
      {
        nombre: 'Servicio "Premium", Palma',
        descripcion: "Comas, y acentos: Sóller, Andratx",
      },
    ];

    const csv = convertToCsv(testData);
    expect(csv).toContain('""Premium""');
    expect(csv).toContain('"Comas, y acentos: Sóller, Andratx"');
  });

  it("debe producir un JSON parseable y estricto para las series históricas semestrales", () => {
    const flatHistorical: Record<string, unknown>[] = [];
    HISTORICAL_SECTOR_SERIES.forEach((sector) => {
      sector.dataPoints.forEach((dp) => {
        flatHistorical.push({
          sector_id: sector.id,
          sector_nombre: sector.title.es.split(":")[0],
          tema: sector.theme,
          semestre: dp.period,
          ano: dp.year,
          semestre_num: dp.semester,
          valor: dp.value,
          fuente: sector.sourceEntity,
        });
      });
    });

    const jsonString = JSON.stringify(flatHistorical, null, 2);
    const parsed = JSON.parse(jsonString);

    expect(Array.isArray(parsed)).toBe(true);
    // 16 sectores x 41 semestres = 656 registros
    expect(parsed.length).toBe(656);
    expect(parsed[0]).toHaveProperty("sector_id");
    expect(parsed[0]).toHaveProperty("semestre");
    expect(parsed[0]).toHaveProperty("valor");
  });
});
