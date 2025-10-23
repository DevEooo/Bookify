import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  color: string;
}

export function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-[#1a1c23] rounded-xl p-4 border border-gray-700 hover:border-[#3b82f6] transition-all hover:shadow-lg hover:shadow-blue-500/10">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-[#e5e7eb] text-2xl">{value}</p>
        </div>
      </div>
    </div>
  );
}
