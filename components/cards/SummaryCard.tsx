import { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  bgColor?: string;
  iconColor?: string;
}

export function SummaryCard({
  title,
  value,
  icon,
  bgColor = 'bg-blue-50',
  iconColor = 'text-blue-600',
}: SummaryCardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-6 border border-gray-200 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`text-3xl ${iconColor}`}>{icon}</div>
      </div>
    </div>
  );
}
