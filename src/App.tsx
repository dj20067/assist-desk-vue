import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, Layout, message } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import TopNavigationBar, { OnlineStatus } from "./components/TopNavigationBar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [onlineStatus, setOnlineStatus] = useState<OnlineStatus>('online');

  const handleStatusChange = (status: OnlineStatus) => {
    setOnlineStatus(status);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={zhCN}>
        <BrowserRouter>
            <Layout style={{ minHeight: '100vh', height: '100vh', overflow: 'hidden' }}>
              <TopNavigationBar onStatusChange={handleStatusChange} />
              <Routes>
                <Route path="/" element={<Index onlineStatus={onlineStatus} />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
