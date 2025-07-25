import React, { useState, useEffect } from 'react';
import { Layout, Button, Select, Space, Typography } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import OutboundCallPanel from './OutboundCallPanel';
import './TopNavigationBar.less';

const { Header } = Layout;
const { Text } = Typography;

export type OnlineStatus = 'online' | 'offline' | 'break';
export type CallState = 'idle' | 'calling' | 'connected';

interface TopNavigationBarProps {
  onStatusChange?: (status: OnlineStatus) => void;
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({ onStatusChange }) => {
  const [status, setStatus] = useState<OnlineStatus>('online');
  const [showOutboundPanel, setShowOutboundPanel] = useState(false);
  const [callState, setCallState] = useState<CallState>('idle');
  const [quickCallData, setQuickCallData] = useState<{ phone: string; name: string } | null>(null);

  // 监听直接呼叫事件
  useEffect(() => {
    const handleDirectCall = (event: CustomEvent) => {
      const { phone, name } = event.detail;
      setQuickCallData({ phone, name });
      setShowOutboundPanel(true);
      // 延迟一下确保面板打开后再触发呼叫
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('triggerCall', { detail: { phone, name } }));
      }, 100);
    };

    window.addEventListener('directCall', handleDirectCall as EventListener);
    return () => window.removeEventListener('directCall', handleDirectCall as EventListener);
  }, []);

  const handleStatusChange = (value: OnlineStatus) => {
    setStatus(value);
    onStatusChange?.(value);
  };

  const getStatusText = (status: OnlineStatus) => {
    switch (status) {
      case 'online':
        return '在线';
      case 'offline':
        return '离线';
      case 'break':
        return '小休';
      default:
        return '在线';
    }
  };

  const getStatusColor = (status: OnlineStatus) => {
    switch (status) {
      case 'online':
        return '#52c41a';
      case 'offline':
        return '#ff4d4f';
      case 'break':
        return '#faad14';
      default:
        return '#52c41a';
    }
  };

  const getCallStateColor = (state: CallState) => {
    switch (state) {
      case 'calling':
        return '#1890ff';
      case 'connected':
        return '#52c41a';
      default:
        return '#1890ff';
    }
  };

  const getCallStateText = (state: CallState) => {
    switch (state) {
      case 'calling':
        return '呼叫中';
      case 'connected':
        return '通话中';
      default:
        return '外呼';
    }
  };

  return (
    <Header className="top-navigation-header">
      <div className="workspace-title">
        客服工作台
      </div>
      
      <Space size="large" className="header-controls">
        <Button 
          icon={<PhoneOutlined />} 
          type="primary"
          size="small"
          style={{ 
            backgroundColor: getCallStateColor(callState),
            borderColor: getCallStateColor(callState)
          }}
          className="outbound-call-btn"
          onClick={() => {
            if (showOutboundPanel) {
              // 如果面板已显示，触发摇晃动画
              console.log('触发摇晃动画');
              window.dispatchEvent(new Event('shakePanel'));
            } else {
              // 如果面板未显示，打开面板
              console.log('打开外呼面板');
              setShowOutboundPanel(true);
            }
          }}
        >
          <span className="btn-text">{getCallStateText(callState)}</span>
          {callState === 'connected' && (
            <div className="sound-wave-container">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="sound-wave-bar" />
              ))}
            </div>
          )}
        </Button>
        
        <Space align="center" className="status-controls">
          <Text className="status-text">状态：</Text>
          <Select
            value={status}
            onChange={handleStatusChange}
            className="status-select"
            size="small"
          >
            <Select.Option value="online">
              <div className="status-option">
                <div className="status-dot online" />
                在线
              </div>
            </Select.Option>
            <Select.Option value="offline">
              <div className="status-option">
                <div className="status-dot offline" />
                离线
              </div>
            </Select.Option>
            <Select.Option value="break">
              <div className="status-option">
                <div className="status-dot break" />
                小休
              </div>
            </Select.Option>
          </Select>
        </Space>
      </Space>

      {/* 外呼面板 */}
      <OutboundCallPanel 
        visible={showOutboundPanel}
        onClose={() => {
          setShowOutboundPanel(false);
          setQuickCallData(null);
        }}
        onCallStateChange={setCallState}
        quickCallData={quickCallData}
      />
      
    </Header>
  );
};

export default TopNavigationBar;