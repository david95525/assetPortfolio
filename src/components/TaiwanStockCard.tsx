import React, {useEffect, useState} from "react";
import {ActivityIndicator, Dimensions, StyleSheet, Text, View} from "react-native";
import {LineChart} from "react-native-chart-kit";
interface Props {
  symbol: string; // e.g., "0050"
}
interface StockInfo {
  n: string; // 名稱
  z: string; // 現價
  y: string; // 昨收
  v: string; // 成交量
  o: string; // 開盤
  h: string; // 最高
  l: string; // 最低
  tlong: string; // 時間戳 (ms)
}
const screenWidth = Dimensions.get("window").width;

export const TaiwanStockCard: React.FC<Props> = ({ symbol }) => {
  const [stockData, setStockData] = useState<StockInfo | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState<string | null>(null);
  const [percent, setPercent] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  const fetchPrice = async () => {
    try {
      const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?json=1&delay=0&ex_ch=tse_${symbol}.tw`;
      const res = await fetch(url);
      const json = await res.json();
      const info = json.msgArray?.[0];
      if (info && !isNaN(info.z)) {
        setStockData(info);
        const latest = parseFloat(info.z);
        const diff = parseFloat(info.z) - parseFloat(info.y);
        const pct = ((diff / parseFloat(info.y)) * 100).toFixed(2);

        setChange(diff.toFixed(2));
        setPercent(pct);
        setUpdatedAt(info.tlong);

        setPrice(latest);
        setHistory((prev) => [...prev.slice(-19), latest]); // 最多20筆
      }
    } catch (e) {
      console.error("Fetch  error:", e);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 5000); // 每5秒更新
    return () => clearInterval(interval);
  }, []);

  const updateTime = updatedAt
    ? new Date(parseInt(updatedAt)).toLocaleTimeString("zh-TW", {
        timeZone: "Asia/Taipei",
        hour12: false,
      })
    : "";

  return (
    <View style={styles.card}>
      {price === null ? (
        <ActivityIndicator />
      ) : (
        <>
          {stockData ? (
            <View style={styles.infoBlock}>
              <Text style={styles.name}>
                {stockData.n}（{symbol}）
              </Text>
              <Text style={styles.price}>股價：{price ?? stockData.y} 元</Text>
              <Text style={{ color: parseFloat(change!) >= 0 ? "green" : "red" }}>
                漲跌：{change}（{percent}%）
              </Text>
              <Text>
                開盤：{stockData.o}｜最高：{stockData.h}｜最低：{stockData.l}
              </Text>
              <Text>成交量：{stockData.v}</Text>
              <Text>更新時間：{updateTime}</Text>
            </View>
          ) : (
            <Text>無資料</Text>
          )}
          {history.length >= 2 && (
            <LineChart
              data={{
                labels: Array(history.length).fill(""),
                datasets: [{ data: history }],
              }}
              width={screenWidth - 32}
              height={160}
              withDots={false}
              withInnerLines={false}
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: () => "#007aff",
              }}
              bezier
              style={{ marginTop: 12 }}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },
  infoBlock: {
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 24,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
});
