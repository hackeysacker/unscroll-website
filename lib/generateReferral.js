export function generateReferralCode() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return "focus" + num.toString();
}
