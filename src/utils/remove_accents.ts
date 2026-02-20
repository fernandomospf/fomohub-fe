export function removeAccents(str?: string | null) {
  if (!str) return "";

  let result = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .replace(/^[^a-zA-Z]+/, "");

  return `@${result}`;
}
