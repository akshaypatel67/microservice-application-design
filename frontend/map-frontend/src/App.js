import '@ant-design/v5-patch-for-react-19';

import { ConfigProvider } from 'antd';

import AuthProvider from "provider/authProvider";
import Routes from "routes";

const theme = {
  "token": {
    colorPrimary: '#000000',
    colorInfo: '#000000',
    fontFamily: 'inherit',
    colorPrimaryTextActive: '#ffffff',
    colorSecondaryBg: '#e6e6e6'
  },
  components: {
    Select: {
      optionSelectedColor: '#ffffff', // Text color of selected item
    },
    "Menu": {
      "itemSelectedBg": "rgb(0,0,0)",
      "itemSelectedColor": "rgb(255,255,255)",
      "colorSplit": "rgb(255,255,255)",
    }
  }
}

function App() {
  return (
    <ConfigProvider theme={theme}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;