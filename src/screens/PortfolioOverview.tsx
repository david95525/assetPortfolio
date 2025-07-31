import {useNavigation} from "@react-navigation/native";
import {Button, ScrollView, Text} from "react-native";

export default function PortfolioOverview() {
  const navigation = useNavigation();

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>投資組合績效總覽</Text>
      {/* TODO: 總體績效卡片 */}
      {/* TODO: 年化報酬圖 */}
      {/* TODO: 資產波動圖 */}

      <Button
        title="新增投資紀錄"
        onPress={() => navigation.navigate("AddInvestment" as never)}
      />
      <Button
        title="查看資產配置"
        onPress={() => navigation.navigate("AssetAllocation" as never)}
      />
    </ScrollView>
  );
}
