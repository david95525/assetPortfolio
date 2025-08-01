import {useNavigation} from "@react-navigation/native";
import React from "react";
import {Button, ScrollView, StyleSheet, Text, View} from "react-native";
import {InvestmentCard} from "../components/InvestmentCard"; // 你上面寫的 InvestmentCard
import {PerformanceChart} from "../components/PerformanceChart";
import {useAssetStore} from "../store/useAssetStore";
export default function PortfolioOverview() {
  const navigation = useNavigation();
  const investments = useAssetStore((s) => s.investments);
  const now = new Date();
  let totalValue = 0;
  let totalCost = 0;
  let weightedReturns: number[] = [];
  let weights: number[] = [];

  return (
    <ScrollView style={{ padding: 10 }}>
      <Text style={styles.title}>績效總覽</Text>
      {investments.map((investment) => (
        <InvestmentCard key={investment.id} investment={investment} />      ))}

      {investments.length > 0 && <PerformanceChart investments={investments} />}

      <Button
        title="新增投資紀錄"
        onPress={() => navigation.navigate("AddInvestment" as never)}
      />
      <View style={{ height: 8 }} />
      <Button
        title="查看資產配置"
        onPress={() => navigation.navigate("AssetAllocation" as never)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
});

