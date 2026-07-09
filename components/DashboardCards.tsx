// ------------------------------------------------------------
// DashboardCards Component
// Displays four statistic cards:
// Vehicles Detected, Average Speed, Maximum Speed, Risk Percentage
// ------------------------------------------------------------

interface DashboardCardsProps {
  vehicleCount: number;
  averageSpeed: number;
  maxSpeed: number;
  riskPercentage: number;
}

export default function DashboardCards({
  vehicleCount,
  averageSpeed,
  maxSpeed,
  riskPercentage,
}: DashboardCardsProps) {
  // Determine risk color based on percentage
  const getRiskColor = (risk: number) => {
    if (risk < 40) return "text-safe";
    if (risk < 70) return "text-medium";
    return "text-risk";
  };

  const cards = [
    {
      label: "Vehicles Detected",
      value: vehicleCount,
      unit: "",
      icon: "🚙",
      valueClass: "text-brand-700",
    },
    {
      label: "Average Speed",
      value: averageSpeed,
      unit: "km/h",
      icon: "📊",
      valueClass: "text-brand-700",
    },
    {
      label: "Maximum Speed",
      value: maxSpeed,
      unit: "km/h",
      icon: "🚀",
      valueClass: "text-brand-700",
    },
    {
      label: "Risk Percentage",
      value: riskPercentage,
      unit: "%",
      icon: "⚠️",
      valueClass: getRiskColor(riskPercentage),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card) => (
        <div key={card.label} className="card card-hover text-center">
          <div className="text-2xl mb-2">{card.icon}</div>
          <p className="text-xs sm:text-sm text-gray-500 mb-1">
            {card.label}
          </p>
          <p className={`text-xl sm:text-2xl font-bold ${card.valueClass}`}>
            {card.value}
            <span className="text-sm font-normal ml-1">{card.unit}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
