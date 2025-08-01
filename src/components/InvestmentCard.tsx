import {StyleSheet, Text, View} from "react-native";
import {useAssetPrice} from "../hooks/useAssetPrice";
import type {Investment} from "../types/Asset";
import {formatTWD} from "../utils/formatters";
interface InvestmentCardProps {
  investment: Investment;
}

export const InvestmentCard: React.FC<InvestmentCardProps> = ({ investment }) => {
  const price = useAssetPrice(investment.symbol);
  if (price == null) return null;
  const amount = price * investment.shares;
  const cost = investment.price * investment.shares;
  const netprofit = amount - cost;
  const netprofitratio = (cost !== 0 ? netprofit / cost : 0) * 100;
  const profitColor = netprofit >= 0 ? "green" : "red";
  return (
    <View style={styles.card}>
      <Text>{investment.symbol}</Text>
      <Text>
        成本價: {formatTWD(investment.price)} 市價: {formatTWD(price)} 市值: ${formatTWD(amount)}
      </Text>
      <Text style={{ color: profitColor }}>
        損益: {formatTWD(netprofit)} 損益率: {netprofitratio.toFixed(2)}%
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    marginBottom: 12,
  },
});
