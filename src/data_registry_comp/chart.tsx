
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
  width?: number | string;
  height?: number | string;
}

const Chart = ({
  data = [],
  xKey,
  yKey,
  color = "#0ea5e9",
  width = "100%",
  height = 300,
}: ChartProps) => {
  if (!data || !xKey || !yKey) return null;

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
