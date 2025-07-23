import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, Layout } from 'antd';
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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout style={{ minHeight: '100vh' }}>
              <TopNavigationBar onStatusChange={handleStatusChange} />
              <Routes>
                <Route path="/" element={<Index onlineStatus={onlineStatus} />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
