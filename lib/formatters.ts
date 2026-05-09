export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-AU", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

export const formatCurrency = (amount: number) => {
  if (amount === null || amount === undefined) {
    return "$0.00";
  }
  return amount.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
  });
};
