export const calculateStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
};

export const PasswordStrength = ({ password }) => {
  const score = calculateStrength(password);
  const colors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
  const width = (score / 4) * 100;

  return (
    <div className="w-full h-2 bg-gray-300 rounded mt-2 overflow-hidden">
      <div
        className={`h-2 rounded transition-all duration-500 ${colors[score - 1] || "bg-gray-200"}`}
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};