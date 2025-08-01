import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Pie, PolarChart} from "victory-native";

export interface AssetData {
  name: string;
  value: number;
}

interface Props {
  data: AssetData[];
}
const chartColors = ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f", "#edc948", "#af7aa1"];

export const AssetAllocationChart: React.FC<Props> = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) {
    return <Text style={{ textAlign: "center", marginTop: 24 }}>尚未有資產資料</Text>;
  }
  const chartData = data.map((d, index) => ({
    value: d.value,
    color: chartColors[index % chartColors.length],
    label: `${d.name}(${((d.value / total) * 100).toFixed(2)}%)`,
  }));
  return (
    <View style={{ paddingHorizontal: 16 }} >
      <View style={{ height: 300 }}>
        <PolarChart data={chartData} labelKey="label" valueKey="value" colorKey="color">
          <Pie.Chart />
        </PolarChart>
      </View>

      <View style={{ marginTop: 24 }}>
        {chartData.map((item, index) => {
          return (
            <View key={item.label + index} style={[styles.assetRow]}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text style={styles.assetText}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  assetRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  assetText: {
    fontSize: 16,
  },
});
