export const generatePNR = () => {
  const time = Date.now().toString();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PNR${time}${random}`;
};
