import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, List, Typography, Space, Tag, Avatar, Divider, Progress } from 'antd';
import { PhoneOutlined, CloseOutlined, MinusOutlined, DragOutlined, UserOutlined, ExpandOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface OutboundCallPanelProps {
  visible: boolean;
  onClose: () => void;
  onShake?: () => void;
  onCallStateChange?: (state: 'idle' | 'calling' | 'connected') => void;
  quickCallData?: { phone: string; name: string } | null;
}

interface CallHistory {
  id: string;
  name: string;
  phone: string;
  callTime: string;
  duration: string;
  type: 'outbound' | 'inbound';
  status: 'completed' | 'missed' | 'busy';
}

const OutboundCallPanel: React.FC<OutboundCallPanelProps> = ({ visible, onClose, onShake, onCallStateChange, quickCallData }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected'>('idle');
  const [currentCall, setCurrentCall] = useState<{ name?: string; phone: string } | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // 模拟历史通话记录数据
  const callHistory: CallHistory[] = [
    { id: '1', name: '张小明', phone: '138****8888', callTime: '2024-01-22 14:30', duration: '5分30秒', type: 'outbound', status: 'completed' },
    { id: '2', name: '李小红', phone: '139****9999', callTime: '2024-01-22 11:15', duration: '2分45秒', type: 'inbound', status: 'completed' },
    { id: '3', name: '王小华', phone: '137****7777', callTime: '2024-01-22 09:20', duration: '-', type: 'outbound', status: 'missed' },
    { id: '4', name: '陈小强', phone: '136****6666', callTime: '2024-01-21 16:45', duration: '8分12秒', type: 'outbound', status: 'completed' },
    { id: '5', name: '刘小美', phone: '135****5555', callTime: '2024-01-21 13:30', duration: '-', type: 'inbound', status: 'busy' },
  ];

  const filteredHistory = callHistory.filter(record => 
    record.name.includes(searchValue) || record.phone.includes(searchValue)
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!panelRef.current) return;
    
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // 处理摇晃动画
  useEffect(() => {
    const handleShake = () => {
      console.log('摇晃事件被触发');
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        console.log('摇晃动画结束');
      }, 600);
    };
    
    // 监听父组件触发的摇晃
    window.addEventListener('shakePanel', handleShake);
    return () => window.removeEventListener('shakePanel', handleShake);
  }, []);

  // 处理快捷呼叫数据
  useEffect(() => {
    if (quickCallData && visible) {
      setPhoneNumber(quickCallData.phone);
    }
  }, [quickCallData, visible]);

  const handleCall = (phone: string, record?: CallHistory) => {
    console.log('拨打电话:', phone);
    setCurrentCall({
      name: record?.name,
      phone: phone
    });
    setCallState('calling');
    onCallStateChange?.('calling');
    setPhoneNumber('');
    
    // 模拟连接过程
    setTimeout(() => {
      setCallState('connected');
      onCallStateChange?.('connected');
      // 开始计时
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      // 保存timer到ref或state以便清理
      (window as any).callTimer = timer;
    }, 3000);
  };

  const handleHangup = () => {
    setCallState('idle');
    onCallStateChange?.('idle');
    setCurrentCall(null);
    setCallDuration(0);
    if ((window as any).callTimer) {
      clearInterval((window as any).callTimer);
      (window as any).callTimer = null;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallTypeColor = (type: string) => {
    switch (type) {
      case 'outbound': return '#1890ff';
      case 'inbound': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#52c41a';
      case 'missed': return '#ff4d4f';
      case 'busy': return '#faad14';
      default: return '#d9d9d9';
    }
  };

  const getCallStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'missed': return '未接听';
      case 'busy': return '忙线';
      default: return '未知';
    }
  };

  if (!visible) return null;

  return (
    <div
      ref={panelRef}
      className={isShaking ? 'panel-shake' : ''}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: '320px',
        height: isMinimized ? '50px' : '480px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: isShaking ? '0 8px 24px rgba(255,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.12)',
        border: isShaking ? '2px solid #ff4d4f' : '1px solid #d9d9d9',
        zIndex: 2000,
        userSelect: 'none',
        overflow: 'hidden',
        transition: isShaking ? 'none' : 'height 0.3s ease',
        transform: isShaking ? 'translateX(0)' : 'translateX(0)'
      }}
    >
      {/* 标题栏 */}
      <div
        style={{
          height: '50px',
          backgroundColor: callState === 'connected' ? '#52c41a' : '#1890ff',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          cursor: isDragging ? 'grabbing' : 'grab',
          borderRadius: '8px 8px 0 0'
        }}
        onMouseDown={handleMouseDown}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <DragOutlined />
          <PhoneOutlined />
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {callState === 'idle' ? '外呼面板' : callState === 'calling' ? '呼叫中...' : '通话中'}
          </Text>
          {callState === 'connected' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 8 }}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="sound-wave-bar"
                  style={{
                    width: '3px',
                    backgroundColor: 'white',
                    borderRadius: '1px',
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Button
            type="text"
            size="small"
            icon={isMinimized ? <ExpandOutlined /> : <MinusOutlined />}
            onClick={() => setIsMinimized(!isMinimized)}
            style={{ color: 'white' }}
            title={isMinimized ? "展开面板" : "折叠面板"}
          />
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={onClose}
            style={{ color: 'white' }}
          />
        </div>
      </div>

      {/* 面板内容 */}
      {!isMinimized && (
        <div style={{ padding: '16px', height: '430px', overflow: 'auto' }}>
          {callState === 'idle' ? (
            // 正常外呼界面
            <>
              {/* 拨号区域 */}
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>直接拨号</Text>
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    placeholder="输入电话号码..."
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <Button
                    type="primary"
                    icon={<PhoneOutlined />}
                    onClick={() => handleCall(phoneNumber)}
                    disabled={!phoneNumber.trim()}
                  >
                    拨打
                  </Button>
                </Space.Compact>
              </div>

              <Divider />

              {/* 历史通话记录 */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>历史通话记录</Text>
                <Input
                  placeholder="搜索通话记录..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  style={{ marginBottom: 12 }}
                />
                
                <List
                  size="small"
                  dataSource={filteredHistory}
                  renderItem={(record) => (
                    <List.Item
                      style={{
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                      actions={[
                        <Button
                          key="call"
                          type="primary"
                          size="small"
                          icon={<PhoneOutlined />}
                          onClick={() => handleCall(record.phone, record)}
                        >
                          回拨
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            style={{ 
                              backgroundColor: getCallTypeColor(record.type),
                              fontSize: '12px'
                            }}
                          >
                            {record.type === 'outbound' ? '出' : '入'}
                          </Avatar>
                        }
                        title={
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Text strong style={{ fontSize: '14px' }}>{record.name}</Text>
                            <Tag
                              color={getCallStatusColor(record.status)}
                              style={{ 
                                fontSize: '12px', 
                                padding: '2px 6px',
                                lineHeight: '16px',
                                height: 'auto'
                              }}
                            >
                              {getCallStatusText(record.status)}
                            </Tag>
                          </div>
                        }
                        description={
                          <div>
                            <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                              {record.phone}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              {record.callTime} · {record.duration}
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
            </>
          ) : (
            // 呼叫中/通话中界面
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center'
            }}>
              {/* 联系人头像 */}
              <Avatar 
                size={80} 
                src={currentCall?.name ? callHistory.find(r => r.name === currentCall.name)?.name : undefined}
                icon={<UserOutlined />}
                style={{ marginBottom: 16 }}
              />
              
              {/* 联系人信息 */}
              <Text strong style={{ fontSize: '18px', marginBottom: 8 }}>
                {currentCall?.name || '未知联系人'}
              </Text>
              <Text type="secondary" style={{ fontSize: '14px', marginBottom: 16 }}>
                {currentCall?.phone}
              </Text>
              
              {/* 状态显示 */}
              {callState === 'calling' ? (
                <div style={{ marginBottom: 24 }}>
                  <Progress
                    type="circle"
                    percent={100}
                    size={60}
                    status="active"
                    showInfo={false}
                    strokeColor="#1890ff"
                  />
                  <div style={{ marginTop: 12 }}>
                    <Text style={{ color: '#1890ff' }}>正在连接...</Text>
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#52c41a',
                    marginBottom: 8
                  }}>
                    {formatDuration(callDuration)}
                  </div>
                  <Text style={{ color: '#52c41a' }}>通话中</Text>
                </div>
              )}
              
              {/* 挂断按钮 */}
              <Button
                danger
                type="primary"
                size="large"
                shape="circle"
                icon={<PhoneOutlined style={{ transform: 'rotate(135deg)' }} />}
                onClick={handleHangup}
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#ff4d4f',
                  borderColor: '#ff4d4f'
                }}
              />
            </div>
          )}
        </div>
      )}
      
      {/* CSS 动画样式 */}
      <style>{`
        .panel-shake {
          animation: shake 0.6s ease-in-out !important;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        
        .sound-wave-bar {
          height: 12px;
          animation: soundWave 1.4s ease-in-out infinite;
        }
        
        @keyframes soundWave {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
      `}</style>
    </div>
  );
};

export default OutboundCallPanel;