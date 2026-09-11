export const formatDate = (value?: string | null) => value ? new Date(value).toLocaleString() : "—";
