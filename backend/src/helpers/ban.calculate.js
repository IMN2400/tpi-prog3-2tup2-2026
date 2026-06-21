export const calculateBanTime = (date, duration) => {
  const banDate = new Date(date);

  const expirationDate = new Date(banDate);

  expirationDate.setDate(
    expirationDate.getDate() + Number(duration)
  );

  const today = new Date();

  const diffTime = expirationDate - today;

  const remainingDays = Math.ceil(
    diffTime / (1000 * 60 * 60 * 24)
  );

  const isExpired = remainingDays <= 0;

  const remainingText = isExpired
    ? "Ban expirado"
    : remainingDays === 1
      ? "1 día restante"
      : `${remainingDays} días restantes`;

  return {
    expirationDate,
    remainingDays,
    remainingText,
    isExpired,
  };
};