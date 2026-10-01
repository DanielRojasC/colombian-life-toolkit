export interface OfficialSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  note: string;
}

export const officialSources = [
  {
    id: "decreto-1469-2025",
    title: "Decreto 1469 de 2025",
    publisher: "Ministerio del Trabajo",
    url: "https://www.cancilleria.gov.co/normograma/compilacion/docs/decreto_1469_2025.htm",
    note: "Fija el salario mínimo mensual legal de 2026 en $1.750.905 desde el 1 de enero de 2026.",
  },
  {
    id: "decreto-159-2026",
    title: "Decreto 159 de 2026",
    publisher: "Presidencia de la República",
    url: "https://www.cancilleria.gov.co/normograma/compilacion/docs/decreto_0159_2026.htm",
    note: "Fijó transitoriamente el mismo salario mínimo de $1.750.905 mientras se resolvía una medida cautelar. No cambia el valor usado aquí.",
  },
  {
    id: "ley-797-2003",
    title: "Ley 797 de 2003",
    publisher: "Congreso de la República",
    url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=7223",
    note: "Artículo 5: tope de cotización de 25 SMMLV. Artículo 7: el empleador paga el 75 % de la cotización pensional y el trabajador el 25 %, más la tabla del Fondo de Solidaridad Pensional.",
  },
  {
    id: "decreto-4982-2007",
    title: "Decreto 4982 de 2007",
    publisher: "Ministerio de Hacienda y Crédito Público",
    url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=28144",
    note: "Desde el 1 de enero de 2008 la cotización al Sistema General de Pensiones es el 16 % del ingreso base. Compilado en el Decreto 1833 de 2016.",
  },
  {
    id: "ley-100-salud",
    title: "Ley 100 de 1993, artículo 204",
    publisher: "Congreso de la República",
    url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=5248",
    note: "En el régimen contributivo de salud la cotización vigente usada aquí es 12,5 %: 8,5 % empleador y 4 % empleado, según la modificación de la Ley 1122 de 2007.",
  },
  {
    id: "ley-1122-2007",
    title: "Ley 1122 de 2007",
    publisher: "Congreso de la República",
    url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=22632",
    note: "Ajustó la cotización al régimen contributivo de salud. El 0,5 % adicional de salud reemplazó parte del incremento pensional previsto en la Ley 797 de 2003.",
  },
  {
    id: "cst-prima",
    title: "Código Sustantivo del Trabajo, artículo 306",
    publisher: "Secretaría del Senado",
    url: "http://www.secretariasenado.gov.co/senado/basedoc/codigo_sustantivo_trabajo_pr010.html",
    note: "La prima de servicios corresponde a 30 días de salario por año, pagada en dos mitades, por el semestre o proporcional al tiempo trabajado. Texto modificado por la Ley 1788 de 2016.",
  },
  {
    id: "cst-cesantias",
    title: "Código Sustantivo del Trabajo, artículo 249",
    publisher:
      "Fondo de Prestaciones Económicas, Cesantías y Pensiones (FONCEP)",
    url: "https://www.foncep.gov.co/cesantias/preguntas-frecuentes",
    note: "El auxilio de cesantía es un mes de salario por cada año de servicios y proporcionalmente por fracción de año.",
  },
  {
    id: "ley-52-1975",
    title: "Ley 52 de 1975",
    publisher: "Congreso de la República",
    url: "https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=87488",
    note: "Intereses del 12 % anual sobre los saldos de cesantías, en cuantía proporcional al tiempo cuando el pago no cubre el año completo.",
  },
  {
    id: "decreto-116-1976",
    title: "Decreto 116 de 1976",
    publisher: "Departamento Administrativo de la Función Pública",
    url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=3285",
    note: "Reglamenta el pago de los intereses del 12 % anual sobre cesantías.",
  },
  {
    id: "cst-vacaciones",
    title: "Código Sustantivo del Trabajo, artículo 186",
    publisher: "Secretaría del Senado",
    url: "http://www.secretariasenado.gov.co/senado/basedoc/codigo_sustantivo_trabajo.html",
    note: "El trabajador tiene derecho a 15 días hábiles consecutivos de vacaciones remuneradas por cada año de servicio.",
  },
] as const satisfies readonly OfficialSource[];

export type SourceId = (typeof officialSources)[number]["id"];

const sourceMap = new Map(officialSources.map((source) => [source.id, source]));

export function getSource(id: SourceId): OfficialSource {
  const source = sourceMap.get(id);
  if (!source) {
    throw new Error(`Unknown source: ${id}`);
  }

  return source;
}

export function getSources(ids: readonly SourceId[]): OfficialSource[] {
  return ids.map((id) => getSource(id));
}
