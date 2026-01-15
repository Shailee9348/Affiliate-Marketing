"use client";

import { 
  FunnelChart as RechartsFunnelChart, 
  Funnel, 
  LabelList, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import Card from "@/components/ui/Card";
import Icon from "@/components/Icon";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-base-100 p-3 border border-base-200 shadow-xl rounded-lg text-sm">
        <p className="font-bold text-base-content mb-1">{data.name}</p>
        <p className="text-base-content/70">
          Count: <span className="font-mono font-semibold">{data.value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

const FunnelChart = ({ data, title = "Conversion Funnel", loading = false }) => {
  if (loading) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-secondary"></span>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="h-[400px] flex flex-col items-center justify-center text-base-content/50">
        <Icon name="Filter" size={48} className="mb-2 opacity-20" />
        <p>No funnel data available</p>
      </Card>
    );
  }

  // Custom colors for the funnel stages
  const COLORS = [
    'var(--color-primary)', 
    'oklch(var(--p) / 0.8)', 
    'oklch(var(--p) / 0.6)', 
    'oklch(var(--p) / 0.4)'
  ];

  return (
    <Card title={title} className="h-[400px]">
      <div className="w-full h-full min-h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsFunnelChart>
            <Tooltip content={<CustomTooltip />} />
            <Funnel
              dataKey="value"
              data={data}
              isAnimationActive
            >
              <LabelList 
                position="right" 
                fill="oklch(var(--bc))" 
                stroke="none" 
                dataKey="name" 
                className="text-xs font-medium"
              />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
              ))}
            </Funnel>
          </RechartsFunnelChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default FunnelChart;