import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AddInvestment from './src/screens/AddInvestment';
// import AssetAllocation from './src/screens/AssetAllocation';
// import AssetDetail from './src/screens/AssetDetail';
import PortfolioOverview from './src/screens/PortfolioOverview';

export type RootStackParamList = {
  PortfolioOverview: undefined;
  AddInvestment: undefined;
  AssetAllocation: undefined;
  AssetDetail: { assetId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PortfolioOverview">
        <Stack.Screen
          name="PortfolioOverview"
          component={PortfolioOverview}
          options={{ title: '投資組合總覽' }}
        />
        <Stack.Screen
          name="AddInvestment"
          component={AddInvestment}
          options={{ title: '新增投資紀錄' }}
        />
        {/* <Stack.Screen
          name="AssetAllocation"
          component={AssetAllocation}
          options={{ title: '資產配置' }}
        />
        <Stack.Screen
          name="AssetDetail"
          component={AssetDetail}
          options={{ title: '個股 / ETF 詳細' }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
