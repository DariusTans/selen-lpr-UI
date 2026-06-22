// Format an ISO datetime as "DD/MM/YYYY HH:mm:ss" (Buddhist-era optional).
export function formatDateTime(iso: string, beYear = false): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = beYear ? d.getFullYear() + 543 : d.getFullYear();
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${year} ${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}:${pad(d.getSeconds())}`;
}

// Format an ISO date as "DD/MM/YYYY" with Buddhist-era year.
export function formatDateBE(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear() + 543}`;
}
