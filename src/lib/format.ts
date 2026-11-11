const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function parseISODate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
}


export function formatDateRange(inicio: string, fim?: string | null): string {
  const a = parseISODate(inicio);
  if (!fim || fim === inicio) return `${a.d} de ${MESES[a.m - 1]}`;
  const b = parseISODate(fim);
  if (a.y === b.y && a.m === b.m) return `${a.d} a ${b.d} de ${MESES[a.m - 1]}`;
  return `${a.d} de ${MESES[a.m - 1]} a ${b.d} de ${MESES[b.m - 1]}`;
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatPrice(value: number, aPartirDe = false): string {
  const text = brl.format(value).replace(/\u00a0/g, ' ');
  return aPartirDe ? `A partir de ${text}` : text;
}

/** 49 -> "49" | 49.9 -> "49,90" (usado nos cards de plano) */
export function formatPlanPrice(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace('.', ',');
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
