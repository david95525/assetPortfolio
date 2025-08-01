import React, {useState} from "react";
import {Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {AssetAllocationChart} from "../components/AssetAllocationChart";
import {useAssetStore} from "../store/useAssetStore";
import {AssetType} from "../types/Asset";
import {formatTWD} from "../utils/formatters";
const ASSET_TYPES: AssetType[] = [AssetType.Cash, AssetType.Insurance, AssetType.Gold, AssetType.Margin];

export default function AssetAllocation() {
  const assets = useAssetStore((s) => s.assets);
  const addAsset = useAssetStore((s) => s.addAsset);
  const updateAsset = useAssetStore((s) => s.updateAsset);
  const removeAsset = useAssetStore((s) => s.removeAsset);

  const [newType, setNewType] = useState<AssetType>(ASSET_TYPES[0]);
  const [newAmount, setNewAmount] = useState("");
  //edit
  const [editVisible, setEditVisible] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editType, setEditType] = useState<AssetType | null>(null);

  const totals: Partial<Record<AssetType, number>> = {};
  assets.forEach((asset) => {
    const key = asset.type;
    totals[key] = (totals[key] || 0) + asset.amount;
  });

  const assetData = Object.entries(totals).map(([name, value]) => ({ name, value }));

  const handleAdd = () => {
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("金額錯誤", "請輸入有效的金額");
      return;
    }
    addAsset({ type: newType, amount });
    setNewAmount("");
  };

  return (
    <>
      <FlatList
        data={assets}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
            <Text style={styles.title}>資產配置</Text>
            <AssetAllocationChart data={assetData} />
            <View style={styles.row}>
              <Text>類型：</Text>
              {ASSET_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setNewType(t)}
                  style={[styles.typeButton, newType === t && styles.typeSelected]}
                >
                  <Text>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.row}>
              <TextInput
                value={newAmount}
                onChangeText={setNewAmount}
                placeholder="金額"
                keyboardType="numeric"
                style={styles.input}
              />
              <TouchableOpacity onPress={handleAdd} style={styles.addBtn}>
                <Text style={{ color: "#fff" }}>新增資產</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.title, { marginTop: 24 }]}>現有資產</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.assetRow}>
            <Text style={{ flex: 1 }}>{item.type}</Text>
            <Text style={{ flex: 1 }}>{formatTWD(item.amount)}</Text>
            <TouchableOpacity
              onPress={() => {
                setEditId(item.id);
                setEditType(item.type);
                setEditValue(item.amount.toString());
                setEditVisible(true);
              }}
            >
              <Text style={styles.edit}>✏️</Text>
            </TouchableOpacity>
            {item.type !== AssetType.Investment && (
              <TouchableOpacity onPress={() => removeAsset(item.id)}>
                <Text style={styles.delete}>🗑️</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
      {editVisible && (
        <Modal transparent animationType="fade" visible={editVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{editType} 金額修改</Text>
              <TextInput
                value={editValue}
                onChangeText={setEditValue}
                keyboardType="numeric"
                style={styles.modalInput}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setEditVisible(false)}>
                  <Text style={styles.cancelBtn}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const amount = parseFloat(editValue);
                    if (!isNaN(amount) && editId) {
                      updateAsset(editId, { amount });
                    }
                    setEditVisible(false);
                  }}
                >
                  <Text style={styles.confirmBtn}>確認</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  typeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  typeSelected: {
    backgroundColor: "#ddd",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
  },
  addBtn: {
    backgroundColor: "#4e79a7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  assetRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  edit: {
    fontSize: 18,
    marginHorizontal: 12,
  },
  delete: {
    fontSize: 18,
    color: "red",
  },
  disabledDelete: {
    color: "#aaa", // 灰色顯示不可點擊
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelBtn: {
    color: "#888",
    fontSize: 16,
  },
  confirmBtn: {
    color: "#4e79a7",
    fontSize: 16,
    fontWeight: "bold",
  },
});
