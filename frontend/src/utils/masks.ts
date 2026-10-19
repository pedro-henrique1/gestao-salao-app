export function apenasDigitos(valor: string) {
  return valor.replace(/\D/g, '');
}

export function formatarTelefone(valor: string) {
  const digits = apenasDigitos(valor).slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatarMoedaInput(valor: string | number) {
  const digits = typeof valor === 'number'
    ? Math.round(valor * 100).toString()
    : apenasDigitos(valor);
  if (!digits) return '';
  return (Number(digits) / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function parseMoedaInput(valor: string) {
  const digits = apenasDigitos(valor);
  return digits ? Number(digits) / 100 : 0;
}

export function emailValido(valor: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim());
}

export function dataFutura(valor: string) {
  return Boolean(valor) && new Date(valor).getTime() > Date.now();
}
