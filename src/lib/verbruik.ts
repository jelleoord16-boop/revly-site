type Drempel = { deelnemers: number; deelnemerMaanden: number; kilometers: number; maxAandeel: number };
type Model = { rdw: number; revly: { gemiddelde: number; deelnemers: number; deelnemerMaanden: number; kilometers: number; grootsteAandeel: number } };

// Dezelfde regels als in de privacyverklaring: kleine groepen krijgen geen cijfers.
export function genoegData(m: Model, d: Drempel) {
  return (
    m.revly.deelnemers >= d.deelnemers &&
    m.revly.deelnemerMaanden >= d.deelnemerMaanden &&
    m.revly.kilometers >= d.kilometers &&
    m.revly.grootsteAandeel <= d.maxAandeel
  );
}

export function verschil(m: Model) {
  return Math.round(((m.revly.gemiddelde - m.rdw) / m.rdw) * 100);
}

export function fmt(n: number) {
  return n.toLocaleString('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

// Aantallen naar beneden afronden, zoals in de app.
export function afgerondKm(km: number) {
  return (Math.floor(km / 1000) * 1000).toLocaleString('nl-NL');
}
export function afgerondAantal(n: number) {
  return n >= 20 ? `ruim ${Math.floor(n / 5) * 5}` : String(n);
}
