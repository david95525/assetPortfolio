// components/PerformanceChart.tsx
import React from "react";
import {Dimensions, Text} from "react-native";
import {LineChart} from "react-native-chart-kit";
import {useAssetPrice} from "../hooks/useAssetPrice";
import {Investment} from "../types/Asset";

const screenWidth = Dimensions.get("window").width;

interface PerformanceChartProps {
  investments: Investment[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ investments }) => {
  const now = new Date();
  const grouped: Record<string, { returns: number[]; weights: number[] }> = {};
  for (const inv of investments) {
    const livePrice = useAssetPrice(inv.symbol);
    if (livePrice == null) continue;

    const date = new Date(inv.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    const invested = inv.price * inv.shares;
 
    const currentValue = livePrice * inv.shares;
    const returnRate = (currentValue - invested) / invested;
     
    const holdingYears = (now.getTime() - date.getTime()) / (365 * 24 * 60 * 60 * 1000);
    const annualized = holdingYears > 0 ? (1 + returnRate) ** (1 / holdingYears) - 1 : returnRate;
  console.log(holdingYears);
    if (!grouped[monthKey]) grouped[monthKey] = { returns: [], weights: [] };
    grouped[monthKey].returns.push(annualized);
    grouped[monthKey].weights.push(invested);
  }

  const labels = Object.keys(grouped).sort();
  const avgReturns: number[] = [];
  const volatility: number[] = [];

  for (const key of labels) {
    const { returns, weights } = grouped[key];
    const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;
    const weightedAvg = returns.reduce((sum, r, i) => sum + r * weights[i], 0) / totalWeight;

    const std =
      Math.sqrt(returns.map((r, i) => (r - weightedAvg) ** 2 * weights[i]).reduce((a, b) => a + b, 0) / totalWeight) ||
      0;

    avgReturns.push(weightedAvg * 100);
    volatility.push(std * 100);
  }
  console.log(investments);
  if (labels.length === 0) return null;

  return (
    <>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>年化報酬與波動率變化</Text>
      <LineChart
        data={{
          labels,
          datasets: [
            {
              data: avgReturns,
              color: () => "rgba(0, 128, 255, 1)",
              strokeWidth: 2,
            },
            {
              data: volatility,
              color: () => "rgba(255, 99, 132, 1)",
              strokeWidth: 2,
            },
          ],
          legend: ["年化報酬率 (%)", "波動率 (%)"],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          decimalPlaces: 2,
        }}
        bezier
        style={{ borderRadius: 16, marginBottom: 24 }}
      />
    </>
  );
};
