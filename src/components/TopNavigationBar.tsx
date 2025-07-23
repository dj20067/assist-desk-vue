import React, { useState } from 'react';
import { Layout, Button, Select, Space, Typography } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import OutboundCallPanel from './OutboundCallPanel';
import './TopNavigationBar.css';

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
    <Header 
      style={{ 
        backgroundColor: '#fff', 
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxSizing: 'border-box'
      }}
    >
      <div style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        color: '#1890ff',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        客服工作台
      </div>
      
      <Space size="large" style={{ flexShrink: 0 }}>
        <Button 
          icon={<PhoneOutlined />} 
          type="primary"
          size="small"
          style={{ 
            minWidth: 'auto', 
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 1, marginLeft: 4 }}>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '2px',
                    height: '8px',
                    backgroundColor: 'white',
                    borderRadius: '1px',
                    animation: `soundWave 1.4s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}
        </Button>
        
        <Space align="center" style={{ whiteSpace: 'nowrap' }}>
          <Text style={{ marginRight: 8, fontSize: '14px' }}>状态：</Text>
          <Select
            value={status}
            onChange={handleStatusChange}
            style={{ width: 100 }}
            size="small"
          >
            <Select.Option value="online">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div 
                  style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: getStatusColor('online'),
                    marginRight: 6 
                  }} 
                />
                在线
              </div>
            </Select.Option>
            <Select.Option value="offline">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div 
                  style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: getStatusColor('offline'),
                    marginRight: 6 
                  }} 
                />
                离线
              </div>
            </Select.Option>
            <Select.Option value="break">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div 
                  style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: getStatusColor('break'),
                    marginRight: 6 
                  }} 
                />
                小休
              </div>
            </Select.Option>
          </Select>
        </Space>
      </Space>

      {/* 外呼面板 */}
      <OutboundCallPanel 
        visible={showOutboundPanel}
        onClose={() => setShowOutboundPanel(false)}
        onCallStateChange={setCallState}
      />
      
      {/* CSS 动画样式 */}
      <style>{`
        @keyframes soundWave {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
      `}</style>
    </Header>
  );
};

export default TopNavigationBar;