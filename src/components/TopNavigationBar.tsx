import React, { useState } from 'react';
import { Layout, Button, Select, Space, Typography } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import './TopNavigationBar.css';

const { Header } = Layout;
const { Text } = Typography;

export type OnlineStatus = 'online' | 'offline' | 'break';

interface TopNavigationBarProps {
  onStatusChange?: (status: OnlineStatus) => void;
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({ onStatusChange }) => {
  const [status, setStatus] = useState<OnlineStatus>('online');

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
          style={{ minWidth: 'auto' }}
          className="outbound-call-btn"
        >
          <span className="btn-text">外呼</span>
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
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            marginLeft: 8
          }}>
            <div 
              style={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                backgroundColor: getStatusColor(status),
                marginRight: 6 
              }} 
            />
            <Text style={{ color: getStatusColor(status), fontWeight: 500 }}>
              {getStatusText(status)}
            </Text>
          </div>
        </Space>
      </Space>
    </Header>
  );
};

export default TopNavigationBar;