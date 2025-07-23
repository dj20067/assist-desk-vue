import React, { useState, useEffect } from 'react';
import { Layout, Tabs, List, Avatar, Badge, Button, Input, Space, Tag, Collapse, Typography, Divider, Upload, Modal, Image, Timeline, Tooltip, Popover, Select } from 'antd';
import { MessageOutlined, PhoneOutlined, FileTextOutlined, UserOutlined, SearchOutlined, PictureOutlined, SmileOutlined, SendOutlined, SwapOutlined, CopyOutlined, ExpandOutlined, FileSearchOutlined, PoweroffOutlined } from '@ant-design/icons';
import { User, Settings, History, Info } from 'lucide-react';
import { OnlineStatus } from './TopNavigationBar';
import './CustomerServiceWorkspace.less';
const {
  Sider,
  Content
} = Layout;
const {
  TabPane
} = Tabs;
const {
  Panel
} = Collapse;
const {
  TextArea
} = Input;
const {
  Text,
  Title
} = Typography;
interface ConversationItem {
  id: string;
  userName: string;
  avatar: string;
  lastMessage: string;
  waitTime: number;
  unreadCount: number;
  status: 'waiting' | 'serving' | 'completed';
  priority: 'normal' | 'warning' | 'urgent';
  enterpriseScale: 'SKA' | 'KA' | 'SMB';
  hasCertificate: boolean;
}
interface Message {
  id: string;
  type: 'text' | 'image' | 'code';
  content: string;
  sender: 'user' | 'agent';
  timestamp: string;
}
interface CustomerServiceWorkspaceProps {
  onlineStatus: OnlineStatus;
}

const CustomerServiceWorkspace: React.FC<CustomerServiceWorkspaceProps> = ({ onlineStatus }) => {
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<string>('waiting');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [historyModalVisible, setHistoryModalVisible] = useState<boolean>(false);
  const [serviceSummaryModalVisible, setServiceSummaryModalVisible] = useState<boolean>(false);
  const [transferModalVisible, setTransferModalVisible] = useState<boolean>(false);
  const [endSessionModalVisible, setEndSessionModalVisible] = useState<boolean>(false);
  const [transferNotifications, setTransferNotifications] = useState<any[]>([]);
  const [notificationExpanded, setNotificationExpanded] = useState<boolean>(false);
  const [notificationTimers, setNotificationTimers] = useState<{[key: string]: number}>({});
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [notesSaveStatus, setNotesSaveStatus] = useState<string>('');
  const [transferActiveTab, setTransferActiveTab] = useState<string>('customer-service');
  const [transferSearchValue, setTransferSearchValue] = useState<string>('');
  const [transferProblemDesc, setTransferProblemDesc] = useState<string>('');
  const [selectedTransferTarget, setSelectedTransferTarget] = useState<string>('');
  const [serviceSummaryForm, setServiceSummaryForm] = useState({
    problemStatus: '',
    consultType: '',
    problemDescription: '',
    solution: ''
  });

  // 播放通知音效
  const playNotificationSound = () => {
    try {
      // 创建音频上下文并播放通知音
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('无法播放通知音效:', error);
    }
  };

  // 模拟转接申请数据
  const transferRequests = [
    {
      id: '1',
      fromEngineer: '技术支持-小李',
      customer: '王小刚',
      reason: '客户咨询高级功能配置问题，需要专业工程师协助',
      waitTime: '2分钟前'
    },
    {
      id: '2', 
      fromEngineer: '售前支持-小张',
      customer: '刘小华',
      reason: '客户询问企业版功能详情，需要技术确认',
      waitTime: '5分钟前'
    },
    {
      id: '3',
      fromEngineer: '客服-小王',
      customer: '陈小明',
      reason: '流程执行异常，需要工程师排查问题',
      waitTime: '1分钟前'
    }
  ];

  // 每10秒弹出转接申请通知（仅在在线状态下）
  useEffect(() => {
    const interval = setInterval(() => {
      // 只有在线状态才接受新的转接申请
      if (onlineStatus !== 'online') {
        return;
      }
      
      const randomRequest = transferRequests[Math.floor(Math.random() * transferRequests.length)];
      const newNotification = {
        ...randomRequest,
        notificationId: Date.now().toString(),
        timestamp: new Date()
      };
      
      setTransferNotifications(prev => [...prev, newNotification]);
      
      // 为新通知设置30秒倒计时
      setNotificationTimers(prev => ({
        ...prev,
        [newNotification.notificationId]: 30
      }));
      
      // 播放通知音效
      playNotificationSound();
    }, 10000);

    return () => clearInterval(interval);
  }, [onlineStatus]);

  // 30秒自动拒绝转接申请
  useEffect(() => {
    const interval = setInterval(() => {
      setNotificationTimers(prev => {
        const updated = { ...prev };
        let hasExpired = false;
        
        Object.keys(updated).forEach(notificationId => {
          updated[notificationId] -= 1;
          if (updated[notificationId] <= 0) {
            // 自动拒绝转接
            setTransferNotifications(prevNotifications => 
              prevNotifications.filter(n => n.notificationId !== notificationId)
            );
            delete updated[notificationId];
            hasExpired = true;
          }
        });
        
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    type: 'text',
    content: '您好，我需要咨询一下RPA流程的问题',
    sender: 'user',
    timestamp: '10:30'
  }, {
    id: '2',
    type: 'text',
    content: '您好！我是客服小王，很高兴为您服务。请详细描述一下您遇到的问题。',
    sender: 'agent',
    timestamp: '10:31'
  }, {
    id: '3',
    type: 'code',
    content: `function processData(data) {
  return data.map(item => ({
    ...item,
    processed: true
  }));
}`,
    sender: 'user',
    timestamp: '10:32'
  }]);

  // 历史会话消息数据
  const historyMessages: Message[] = [{
    id: 'h1',
    type: 'text',
    content: '您好，我遇到了RPA流程配置的问题，能帮我看看吗？',
    sender: 'user',
    timestamp: '10:30'
  }, {
    id: 'h2',
    type: 'text',
    content: '您好！我是客服小王，很高兴为您服务。请详细描述一下遇到的问题。',
    sender: 'agent',
    timestamp: '10:31'
  }, {
    id: 'h3',
    type: 'text',
    content: '我在执行流程时总是提示"连接超时"错误，已经重试好几次了。',
    sender: 'user',
    timestamp: '10:32'
  }, {
    id: 'h4',
    type: 'text',
    content: '我来帮您检查一下系统状态，请稍等片刻。这可能是网络连接或者权限配置的问题。',
    sender: 'agent',
    timestamp: '10:33'
  }, {
    id: 'h5',
    type: 'text',
    content: '我查看了您的日志，发现是RPA应用包的权限配置有问题。我已经为您重新配置了权限，请重新尝试执行流程。',
    sender: 'agent',
    timestamp: '10:35'
  }, {
    id: 'h6',
    type: 'text',
    content: '太好了！现在可以正常执行了，谢谢您的帮助！',
    sender: 'user',
    timestamp: '10:37'
  }, {
    id: 'h7',
    type: 'text',
    content: '问题已经为您解决，如果您还有其他问题，随时联系我们。祝您工作愉快！',
    sender: 'agent',
    timestamp: '10:38'
  }];

  // 常用语数据
  const commonPhrases = [{
    category: '问候语',
    phrases: ['您好！我是客服小王，很高兴为您服务。', '您好，请问有什么可以帮助您的吗？', '感谢您的耐心等待，现在为您服务。']
  }, {
    category: '技术支持',
    phrases: ['请您详细描述一下遇到的问题，我来帮您解决。', '我来为您检查一下系统状态，请稍等。', '这个问题我需要联系技术人员确认，请稍等片刻。', '请您提供一下错误截图，这样我能更好地帮您解决问题。']
  }, {
    category: 'RPA相关',
    phrases: ['关于RPA流程配置，您可以参考我们的帮助文档。', '请确认您的RPA应用包版本是否为最新版本。', '这个RPA流程执行失败可能是权限问题，我来帮您检查。']
  }, {
    category: '结束语',
    phrases: ['问题已经为您解决，还有其他需要帮助的吗？', '如果您还有其他问题，随时联系我们。', '感谢您的使用，祝您工作愉快！']
  }];

  // 模拟数据
  const conversations: ConversationItem[] = [{
    id: '1',
    userName: '张小明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    lastMessage: '您好，我需要咨询一下RPA流程的问题...',
    waitTime: 180,
    unreadCount: 3,
    status: 'waiting',
    priority: 'normal',
    enterpriseScale: 'KA',
    hasCertificate: true
  }, {
    id: '2',
    userName: '李小红',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    lastMessage: '系统报错了，请帮忙看看',
    waitTime: 240,
    unreadCount: 0,
    status: 'serving',
    priority: 'warning',
    enterpriseScale: 'SKA',
    hasCertificate: false
  }, {
    id: '3',
    userName: '王小华',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    lastMessage: '谢谢您的帮助！',
    waitTime: 360,
    unreadCount: 0,
    status: 'serving',
    priority: 'urgent',
    enterpriseScale: 'SMB',
    hasCertificate: true
  }];

  // 表情符号数据
  const emojiCategories = [{
    category: '常用',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚']
  }, {
    category: '手势',
    emojis: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏']
  }, {
    category: '工作',
    emojis: ['💼', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '💾', '💿', '📱', '☎️', '📞', '📠', '📧', '📨', '📩', '📤', '📥', '📪', '📫', '📬']
  }, {
    category: '符号',
    emojis: ['❤️', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️']
  }];
  const getConversationsByStatus = (status: string) => {
    return conversations.filter(conv => conv.status === status);
  };
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'warning':
        return 'conversation-warning';
      case 'urgent':
        return 'conversation-urgent';
      default:
        return '';
    }
  };
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'text',
        content: inputMessage,
        sender: 'agent',
        timestamp: timestamp
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputMessage('');
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleSelectPhrase = (phrase: string) => {
    const newMessage = inputMessage ? `${inputMessage}\n${phrase}` : phrase;
    setInputMessage(newMessage);
  };
  const handleHistoryItemClick = (item: any) => {
    setSelectedHistoryItem(item);
    setHistoryModalVisible(true);
  };
  const handleSelectEmoji = (emoji: string) => {
    const newMessage = inputMessage + emoji;
    setInputMessage(newMessage);
  };

  const handleServiceSummaryFormChange = (field: string, value: string) => {
    setServiceSummaryForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceSummarySave = () => {
    console.log('保存服务小计:', serviceSummaryForm);
    // 这里可以添加保存逻辑
    setServiceSummaryModalVisible(false);
    // 重置表单
    setServiceSummaryForm({
      problemStatus: '',
      consultType: '',
      problemDescription: '',
      solution: ''
    });
  };

  const handleServiceSummaryCancel = () => {
    setServiceSummaryModalVisible(false);
    // 重置表单
    setServiceSummaryForm({
      problemStatus: '',
      consultType: '',
      problemDescription: '',
      solution: ''
    });
  };

  const handleTransferConfirm = () => {
    console.log('转接到:', selectedTransferTarget);
    console.log('问题描述:', transferProblemDesc);
    // 这里可以添加转接逻辑
    setTransferModalVisible(false);
    // 重置表单
    setSelectedTransferTarget('');
    setTransferProblemDesc('');
    setTransferSearchValue('');
  };

  const handleTransferCancel = () => {
    setTransferModalVisible(false);
    // 重置表单
    setSelectedTransferTarget('');
    setTransferProblemDesc('');
    setTransferSearchValue('');
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomerNotes(e.target.value);
    setNotesSaveStatus('');
  };

  const handleNotesBlur = () => {
    // 自动保存备注
    console.log('自动保存客户备注:', customerNotes);
    setNotesSaveStatus('已保存');
    // 2秒后清除保存状态提示
    setTimeout(() => {
      setNotesSaveStatus('');
    }, 2000);
  };

  const handleEndSession = () => {
    console.log('结束会话');
    // 这里可以添加结束会话的逻辑，比如更新会话状态为已完成
    setEndSessionModalVisible(false);
    // 可以添加成功提示
  };

  const handleEndSessionCancel = () => {
    setEndSessionModalVisible(false);
  };

  const handleAcceptTransfer = (notificationId: string) => {
    const notification = transferNotifications.find(n => n.notificationId === notificationId);
    console.log('接受转接:', notification);
    setTransferNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
    // 清除对应的计时器
    setNotificationTimers(prev => {
      const updated = { ...prev };
      delete updated[notificationId];
      return updated;
    });
  };

  const handleRejectTransfer = (notificationId: string) => {
    const notification = transferNotifications.find(n => n.notificationId === notificationId);
    console.log('拒绝转接:', notification);
    setTransferNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
    // 清除对应的计时器
    setNotificationTimers(prev => {
      const updated = { ...prev };
      delete updated[notificationId];
      return updated;
    });
  };

  const handleCloseNotification = (notificationId: string) => {
    setTransferNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
    // 清除对应的计时器
    setNotificationTimers(prev => {
      const updated = { ...prev };
      delete updated[notificationId];
      return updated;
    });
  };
  const renderEmojiContent = () => <div style={{
    width: 300,
    maxHeight: 200,
    overflow: 'auto'
  }}>
      <Tabs size="small">
        {emojiCategories.map((category, index) => <TabPane tab={category.category} key={index}>
            <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
          padding: '8px 0'
        }}>
              {category.emojis.map((emoji, emojiIndex) => <Button key={emojiIndex} type="text" size="small" style={{
            fontSize: '18px',
            height: '32px',
            width: '32px',
            padding: 0,
            border: 'none'
          }} onClick={() => handleSelectEmoji(emoji)}>
                  {emoji}
                </Button>)}
            </div>
          </TabPane>)}
      </Tabs>
    </div>;
  const renderCommonPhrasesContent = () => <div style={{
    width: 400,
    maxHeight: 300,
    overflow: 'auto'
  }}>
      <Collapse ghost>
        {commonPhrases.map((category, index) => <Panel header={category.category} key={index}>
            <List size="small" dataSource={category.phrases} renderItem={phrase => <List.Item style={{
          cursor: 'pointer',
          padding: '4px 0'
        }} onClick={() => handleSelectPhrase(phrase)}>
                  <Text>{phrase}</Text>
                </List.Item>} />
          </Panel>)}
      </Collapse>
    </div>;
  const renderConversationItem = (item: ConversationItem) => <List.Item key={item.id} className={`conversation-item ${getPriorityClass(item.priority)} ${selectedConversation === item.id ? 'selected' : ''}`} onClick={() => setSelectedConversation(item.id)}>
      <List.Item.Meta avatar={<Badge count={item.unreadCount} size="small">
            <Avatar src={item.avatar} />
          </Badge>} title={<div className="conversation-header">
            <Text strong>{item.userName}</Text>
            <Text type="secondary" className="wait-time">
              {formatTime(item.waitTime)}
            </Text>
          </div>} description={<div>
            <div style={{
        marginBottom: 4
      }}>
              <Tag color="blue">{item.enterpriseScale}</Tag>
              <Tag color={item.hasCertificate ? "green" : "orange"}>
                {item.hasCertificate ? "有证书" : "无证书"}
              </Tag>
            </div>
            <Text type="secondary" ellipsis>
              {item.lastMessage}
            </Text>
          </div>} />
    </List.Item>;
  const renderMessage = (message: Message) => <div key={message.id} className={`message ${message.sender === 'user' ? 'message-user' : 'message-agent'}`}>
      <div className="message-content">
        {message.type === 'code' ? <div className="code-block">
            <div className="code-header">
              <span>代码</span>
              <Button type="text" size="small" icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(message.content)} />
            </div>
            <pre>{message.content}</pre>
          </div> : message.type === 'image' ? <Image src={message.content} alt="图片消息" style={{
        maxWidth: 200
      }} preview={{
        onVisibleChange: visible => !visible && setPreviewImage('')
      }} /> : <Text style={{
        whiteSpace: 'pre-wrap'
      }}>{message.content}</Text>}
      </div>
      <div className="message-time">
        <Text type="secondary">
          {message.timestamp}
        </Text>
      </div>
    </div>;
  return <Layout className="customer-service-workspace">
      {/* 左侧会话列表 */}
      <Sider width="20%" className="conversation-sidebar">
        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <TabPane tab="待服务" key="waiting">
            <List className="conversation-list" dataSource={getConversationsByStatus('waiting')} renderItem={renderConversationItem} />
          </TabPane>
          <TabPane tab="服务中" key="serving">
            <List className="conversation-list" dataSource={getConversationsByStatus('serving')} renderItem={renderConversationItem} />
          </TabPane>
          <TabPane tab="已完成" key="completed">
            <List className="conversation-list" dataSource={getConversationsByStatus('completed')} renderItem={renderConversationItem} />
          </TabPane>
        </Tabs>
      </Sider>

      {/* 中间聊天区 */}
      <Content className="chat-content">
        <div className="chat-header">
          <div className="user-info">
            <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
            <div className="user-details">
              <Text strong>张小明</Text>
              <div className="user-tags">
                <Tag color="blue">VIP用户</Tag>
                <Tag color="green">企业版</Tag>
              </div>
            </div>
          </div>
          <Space>
            <Button icon={<SwapOutlined />} onClick={() => setTransferModalVisible(true)}>转接</Button>
            <Button icon={<FileSearchOutlined />} onClick={() => setServiceSummaryModalVisible(true)}>服务小计</Button>
            <Button icon={<FileTextOutlined />}>
              新建工单
            </Button>
            <Button 
              icon={<PoweroffOutlined />}
              danger 
              onClick={() => setEndSessionModalVisible(true)}
            >
              结束会话
            </Button>
          </Space>
        </div>

        <div className="chat-messages">
          {messages.map(renderMessage)}
        </div>

        <div className="chat-input">
          <div className="input-toolbar">
            <Space>
              <Popover content={renderEmojiContent()} title="表情符号" trigger="click" placement="topLeft">
                <Button icon={<SmileOutlined />} type="text" />
              </Popover>
              <Upload showUploadList={false}>
                <Button icon={<PictureOutlined />} type="text" />
              </Upload>
              <Popover content={renderCommonPhrasesContent()} title="常用语" trigger="click" placement="topLeft">
                <Button type="text">常用语</Button>
              </Popover>
              <Button type="text">知识库</Button>
            </Space>
          </div>
          <div className="input-area">
            <TextArea value={inputMessage} onChange={e => setInputMessage(e.target.value)} placeholder="请输入消息... (Enter发送，Shift+Enter换行)" autoSize={{
            minRows: 2,
            maxRows: 4
          }} onKeyDown={handleKeyDown} />
            <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage} className="send-button">
              发送
            </Button>
          </div>
        </div>
      </Content>

      {/* 右侧信息区 */}
      <Sider width="30%" className="info-sidebar">
        <Collapse defaultActiveKey={['customer', 'app', 'history', 'moreInfo']} ghost>
          <Panel 
            header={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={16} color="#1890ff" />
                <span>客户信息</span>
              </div>
            } 
            key="customer"
          >
            <div className="customer-info">
              <div className="info-item">
                <Text type="secondary">姓名：</Text>
                <Text>张小明</Text>
              </div>
              <div className="info-item">
                <Text type="secondary">账号：</Text>
                <Text>zhangxm@company.com</Text>
              </div>
              <div className="info-item">
                <Text type="secondary">电话：</Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Text>138****8888</Text>
                  <Button
                    type="primary"
                    size="small"
                    icon={<PhoneOutlined />}
                    style={{ 
                      minWidth: 'auto',
                      width: '24px',
                      height: '24px',
                      padding: '0'
                    }}
                    onClick={() => {
                      // 直接触发呼叫，不显示完整号码
                      window.dispatchEvent(new CustomEvent('directCall', { 
                        detail: { phone: '13888888888', name: '张小明' }
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="info-item">
                <Text type="secondary">公司：</Text>
                <Text>某某科技有限公司</Text>
              </div>
              <div className="info-item">
                <Text type="secondary">标签：</Text>
                <div style={{
                marginTop: 4
              }}>
                  <Tag color="blue">KA客户</Tag>
                  <Tag color="green">有证书</Tag>
                  <Tag color="orange">企业版</Tag>
                  <Tag color="purple">重点客户</Tag>
                </div>
              </div>
              <Divider />
              <div className="info-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text type="secondary">备注：</Text>
                  {notesSaveStatus && (
                    <Text style={{ fontSize: '12px', color: '#52c41a' }}>{notesSaveStatus}</Text>
                  )}
                </div>
                <TextArea 
                  placeholder="添加客户备注..." 
                  rows={3} 
                  value={customerNotes}
                  onChange={handleNotesChange}
                  onBlur={handleNotesBlur}
                />
              </div>
            </div>
          </Panel>

          <Panel 
            header={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Settings size={16} color="#52c41a" />
                <span>应用与日志</span>
              </div>
            } 
            key="app"
          >
            <div className="app-logs">
              <Title level={5}>RPA应用包</Title>
              <List 
                size="small" 
                dataSource={[
                  { name: '财务报表自动化', topic: '816837894440828928' },
                  { name: '数据采集流程', topic: '817228490332155904' },
                  { name: '邮件处理机器人', topic: '817659086224482816' }
                ]} 
                renderItem={item => (
                  <List.Item style={{ padding: 0 }}>
                    <div 
                      className="app-item"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: '1px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f0f8ff';
                        e.currentTarget.style.borderColor = '#1890ff';
                        e.currentTarget.style.transform = 'translateX(2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                      onClick={() => {
                        window.open(`shadowbot:Homework?topic-uuid=${item.topic}&model=0`, '_blank');
                      }}
                    >
                      <div 
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#52c41a',
                          flexShrink: 0
                        }}
                      />
                      <Text style={{ 
                        color: '#1890ff', 
                        fontWeight: 500,
                        fontSize: '13px'
                      }}>
                        {item.name}
                      </Text>
                    </div>
                  </List.Item>
                )} 
              />
              
              <Divider />
              
              <div className="log-search">
                <Input placeholder="搜索日志..." prefix={<SearchOutlined />} style={{
                marginBottom: 16
              }} />
                <div className="log-list">
                  <Timeline>
                    <Timeline.Item color="blue" className="py-[10px]">
                      <div className="log-entry">
                        <Text className="log-timestamp">[2024-01-22 14:30:15]</Text>
                        <Tag color="blue" className="log-level">INFO</Tag>
                        <Text className="log-message">流程开始执行</Text>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item color="blue">
                      <div className="log-entry">
                        <Text className="log-timestamp">[2024-01-22 14:30:16]</Text>
                        <Tag color="blue" className="log-level">INFO</Tag>
                        <Text className="log-message">正在连接数据源</Text>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item color="orange">
                      <div className="log-entry">
                        <Text className="log-timestamp">[2024-01-22 14:30:17]</Text>
                        <Tag color="orange" className="log-level">WARN</Tag>
                        <Text className="log-message">连接超时，正在重试</Text>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item color="red">
                      <div className="log-entry">
                        <Text className="log-timestamp">[2024-01-22 14:30:20]</Text>
                        <Tag color="red" className="log-level">ERROR</Tag>
                        <Text className="log-message">连接失败，请检查网络</Text>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item color="blue">
                      <div className="log-entry">
                        <Text className="log-timestamp">[2024-01-22 14:30:21]</Text>
                        <Tag color="blue" className="log-level">INFO</Tag>
                        <Text className="log-message">流程执行结束</Text>
                      </div>
                    </Timeline.Item>
                  </Timeline>
                </div>
              </div>
            </div>
          </Panel>

          <Panel 
            header={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <History size={16} color="#faad14" />
                <span>服务历史</span>
              </div>
            } 
            key="history"
          >
            <div className="service-history">
              <List size="small" dataSource={[{
              date: '2024-01-15',
              summary: 'RPA流程配置问题咨询',
              status: '已解决'
            }, {
              date: '2024-01-10',
              summary: '系统登录异常',
              status: '已解决'
            }]} renderItem={item => <List.Item style={{
              cursor: 'pointer'
            }} onClick={() => handleHistoryItemClick(item)}>
                    <div className="history-item">
                      <div className="history-date">
                        <Text type="secondary">{item.date}</Text>
                      </div>
                      <div className="history-content">
                        <Text>{item.summary}</Text>
                        <Tag color="green">{item.status}</Tag>
                      </div>
                    </div>
                  </List.Item>} />
            </div>
          </Panel>

          <Panel 
            header={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Info size={16} color="#722ed1" />
                <span>更多信息</span>
              </div>
            } 
            key="moreInfo"
          >
            <div className="more-info">
              <div className="info-item">
                <Text type="secondary">客户状态：</Text>
                <Text>价值稳定阶段</Text>
              </div>
              <div className="info-item">
                <Text type="secondary">证书状态：</Text>
                <Tag color="green">学院证书</Tag>
              </div>
              <div className="info-item">
                <Text type="secondary">RPA合作类型：</Text>
                <Text>-</Text>
              </div>
              <div className="info-item">
                <Text type="secondary">RPA合作状态：</Text>
                <Tag color="purple">未签约组织</Tag>
              </div>
              <div className="info-item">
                <Text type="secondary">签约年份：</Text>
                <Text>-</Text>
              </div>
              <div className="info-item">
                <Text type="secondary">签约季度：</Text>
                <Text>-</Text>
              </div>
              <div className="info-item">
                <Text type="secondary">客户优先级：</Text>
                <Text>低</Text>
              </div>
              <div className="info-item">
                <Text type="secondary">签约时间距今月份：</Text>
                <Text>-1</Text>
              </div>
              <div className="info-item">
                <Text type="secondary">客户成功：</Text>
                <Text>-</Text>
              </div>
              <div className="info-item">
                <Text type="secondary">技术支持：</Text>
                <Text>惠文</Text>
              </div>
              <div className="info-item">
                <Text type="secondary">服务小组：</Text>
                <Tag color="orange">浙江业务组-新签组</Tag>
              </div>
              <div className="info-item">
                <Text type="secondary">健康指标：</Text>
                <Text>0</Text>
              </div>
              <div className="info-item">
                <Text type="secondary">电脑版本类型：</Text>
                <Text>windows</Text>
              </div>
              <div className="info-item">
                <Text type="secondary">客户端版本：</Text>
                <Text>5.29.6</Text>
              </div>
              <div className="info-item">
                <Text type="secondary">应用载图：</Text>
                <Text>-</Text>
              </div>
              <div className="info-item">
                <Text type="secondary">当天日志地址：</Text>
                <Text>-</Text>
              </div>
              <div className="info-item">
                <Text type="secondary">Boss：</Text>
                <Button 
                  type="link" 
                  size="small" 
                  href="https://boss.shadow-rpa.net/simple/appStudio/app/807803110861266944/%E4%BC%81%E4%B8%9A%E8%AF%A6%E6%83%85/OrgDetailPage?organizationUuid=33aebb43-cc64-11ed-91ab-0242ac1b0002"
                  target="_blank"
                  style={{ padding: 0, height: 'auto' }}
                >
                  查看
                </Button>
              </div>
            </div>
          </Panel>
        </Collapse>
      </Sider>

      {/* 历史会话详情模态窗口 */}
      <Modal title="会话历史记录" open={historyModalVisible} onCancel={() => setHistoryModalVisible(false)} footer={null} width={800}>
        {selectedHistoryItem && <div>
            <div style={{
          marginBottom: 16
        }}>
              <Text strong>问题概述：</Text>
              <Text>{selectedHistoryItem.summary}</Text>
            </div>
            <div style={{
          marginBottom: 16
        }}>
              <Text strong>处理日期：</Text>
              <Text>{selectedHistoryItem.date}</Text>
            </div>
            <div style={{
          marginBottom: 16
        }}>
              <Text strong>处理状态：</Text>
              <Tag color="green">{selectedHistoryItem.status}</Tag>
            </div>
            <Divider />
            <div style={{
          marginBottom: 16
        }}>
              <Text strong>会话记录：</Text>
            </div>
            <div className="chat-messages" style={{
          maxHeight: 400,
          overflow: 'auto'
        }}>
              {historyMessages.map(renderMessage)}
            </div>
          </div>}
      </Modal>

      {/* 服务小计模态窗口 */}
      <Modal 
        title="服务小计" 
        open={serviceSummaryModalVisible} 
        onCancel={handleServiceSummaryCancel}
        footer={null}
        width={600}
      >
        <div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 16 }}>
            <Text strong>问题解决状态：</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="请选择问题解决状态"
              value={serviceSummaryForm.problemStatus}
              onChange={(value) => handleServiceSummaryFormChange('problemStatus', value)}
            >
              <Select.Option value="已解决">已解决</Select.Option>
              <Select.Option value="未解决">未解决</Select.Option>
              <Select.Option value="解决中">解决中</Select.Option>
            </Select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Text strong>咨询分类：</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="请选择咨询分类"
              value={serviceSummaryForm.consultType}
              onChange={(value) => handleServiceSummaryFormChange('consultType', value)}
            >
              <Select.Option value="元素问题">元素问题</Select.Option>
              <Select.Option value="网页自动化">网页自动化</Select.Option>
              <Select.Option value="手机自动化">手机自动化</Select.Option>
              <Select.Option value="桌面软件自动化">桌面软件自动化</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Text strong>问题描述：</Text>
            <TextArea
              style={{ marginTop: 8 }}
              rows={4}
              placeholder="请详细描述遇到的问题..."
              value={serviceSummaryForm.problemDescription}
              onChange={(e) => handleServiceSummaryFormChange('problemDescription', e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <Text strong>解决方案：</Text>
            <TextArea
              style={{ marginTop: 8 }}
              rows={4}
              placeholder="请详细描述解决方案..."
              value={serviceSummaryForm.solution}
              onChange={(e) => handleServiceSummaryFormChange('solution', e.target.value)}
            />
          </div>

          <div style={{ textAlign: 'right', borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
            <Space>
              <Button onClick={handleServiceSummaryCancel}>取消</Button>
              <Button type="primary" onClick={handleServiceSummarySave}>保存</Button>
            </Space>
          </div>
        </div>
      </Modal>

      {/* 会话转接模态窗口 */}
      <Modal 
        title="会话转接" 
        open={transferModalVisible} 
        onCancel={handleTransferCancel}
        footer={null}
        width={800}
      >
        <div style={{ padding: '16px 0' }}>
          <Tabs activeKey={transferActiveTab} onChange={setTransferActiveTab} style={{ marginBottom: 24 }}>
            <TabPane tab="客服" key="customer-service">
              <div style={{ marginBottom: 16 }}>
                <Input 
                  placeholder="历史转接人" 
                  disabled 
                  value="没有可转接的客服"
                  style={{ marginBottom: 16, color: '#999' }}
                />
                <Input 
                  placeholder="请输入客服姓名或昵称" 
                  value={transferSearchValue}
                  onChange={(e) => setTransferSearchValue(e.target.value)}
                  prefix={<SearchOutlined />}
                  style={{ marginBottom: 16 }}
                />
                <div style={{ 
                  border: '1px solid #f0f0f0', 
                  borderRadius: 6, 
                  padding: 16, 
                  minHeight: 200,
                  backgroundColor: '#fafafa'
                }}>
                  <List
                    size="small"
                    dataSource={[
                      { id: '1', name: '胡子场控专用(...)', status: '(0/0)', online: false },
                      { id: '2', name: '西南(西南)', status: '(1/1)', online: true },
                      { id: '3', name: '拉拉(拉拉)', status: '(1/1)', online: true },
                      { id: '4', name: '柿子(柿子)', status: '(1/0)', online: true },
                      { id: '5', name: '昕风(昕风)', status: '(1/0)', online: true },
                    ].filter(item => 
                      !transferSearchValue || 
                      item.name.toLowerCase().includes(transferSearchValue.toLowerCase())
                    )}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          cursor: 'pointer',
                          padding: '8px 12px',
                          borderRadius: 4,
                          marginBottom: 4,
                          backgroundColor: selectedTransferTarget === item.id ? '#e6f7ff' : 'white',
                          border: selectedTransferTarget === item.id ? '1px solid #40a9ff' : '1px solid #f0f0f0'
                        }}
                        onClick={() => setSelectedTransferTarget(item.id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Badge status={item.online ? "success" : "default"} />
                          <Text>{item.name}</Text>
                          <Text type="secondary">{item.status}</Text>
                          {item.online && <Tag color="red">🔴</Tag>}
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            </TabPane>
            <TabPane tab="客服组" key="customer-service-group">
              <div style={{ 
                border: '1px solid #f0f0f0', 
                borderRadius: 6, 
                padding: 16, 
                minHeight: 200,
                backgroundColor: '#fafafa',
                textAlign: 'center',
                color: '#999'
              }}>
                暂无客服组数据
              </div>
            </TabPane>
          </Tabs>

          <div style={{ marginBottom: 24 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>请简要概括客户问题</Text>
            <TextArea
              rows={6}
              placeholder="请简要概括客户问题..."
              value={transferProblemDesc}
              onChange={(e) => setTransferProblemDesc(e.target.value)}
            />
          </div>

          <div style={{ textAlign: 'right', borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
            <Space>
              <Button onClick={handleTransferCancel}>取消</Button>
              <Button 
                type="primary" 
                onClick={handleTransferConfirm}
                disabled={!selectedTransferTarget}
              >
                确定
              </Button>
            </Space>
          </div>
        </div>
      </Modal>

      {/* 结束会话确认模态窗口 */}
      <Modal 
        title="结束会话" 
        open={endSessionModalVisible} 
        onCancel={handleEndSessionCancel}
        footer={null}
        width={400}
      >
        <div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 0 }}>
            <Text>确定要结束与 <Text strong>张小明</Text> 的会话吗？</Text>
            <div style={{ marginTop: 8, color: '#666' }}>
              <Text type="secondary">结束后该会话将标记为已完成状态</Text>
            </div>
          </div>

          <div style={{ textAlign: 'right', paddingTop: 16 }}>
            <Space>
              <Button onClick={handleEndSessionCancel}>取消</Button>
              <Button type="primary" onClick={handleEndSession}>结束</Button>
            </Space>
          </div>
        </div>
      </Modal>

      {/* 转接申请通知弹窗 - 可展开查看所有通知 */}
      {transferNotifications.length > 0 && (
        <div 
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid #d9d9d9',
            minWidth: '350px',
            maxWidth: '400px',
            animation: 'fadeInUp 0.3s ease-out'
          }}
        >
          {/* 通知头部 */}
          <div style={{ 
            padding: '12px 16px',
            borderBottom: '1px solid #f0f0f0',
            backgroundColor: '#fafafa',
            borderRadius: '8px 8px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text strong style={{ color: '#1890ff' }}>转接申请</Text>
              {transferNotifications.length > 1 && (
                <Badge 
                  count={transferNotifications.length} 
                  style={{ backgroundColor: '#ff4d4f' }}
                />
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {transferNotifications.length > 1 && (
                <Button 
                  type="text" 
                  size="small"
                  onClick={() => setNotificationExpanded(!notificationExpanded)}
                  style={{ padding: '2px 6px', fontSize: '12px' }}
                >
                  {notificationExpanded ? '收起' : '展开'}
                </Button>
              )}
              <Button 
                type="text" 
                size="small" 
                onClick={() => setTransferNotifications([])}
                style={{ padding: 0, minWidth: 'auto' }}
              >
                ×
              </Button>
            </div>
          </div>
          
          {/* 通知内容区域 */}
          <div style={{ 
            maxHeight: notificationExpanded ? '400px' : 'auto',
            overflowY: 'auto'
          }}>
            {(notificationExpanded ? transferNotifications : transferNotifications.slice(0, 1)).map((notification, index) => (
              <div 
                key={notification.notificationId}
                style={{ 
                  padding: '16px',
                  borderBottom: index < transferNotifications.length - 1 ? '1px solid #f0f0f0' : 'none',
                  backgroundColor: index === 0 && !notificationExpanded ? 'white' : '#fafafa'
                }}
              >
                <div style={{ marginBottom: 12 }}>
                  <Text strong>{notification.fromEngineer}</Text>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    {notification.waitTime}
                  </Text>
                </div>
                
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary">客户：</Text>
                  <Text>{notification.customer}</Text>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary">原因：</Text>
                  <div style={{ marginTop: 4 }}>
                    <Text style={{ fontSize: '13px' }}>{notification.reason}</Text>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <Button 
                    size="small" 
                    onClick={() => handleRejectTransfer(notification.notificationId)}
                  >
                    拒绝 ({notificationTimers[notification.notificationId] || 30}s自动)
                  </Button>
                  <Button 
                    type="primary" 
                    size="small" 
                    onClick={() => handleAcceptTransfer(notification.notificationId)}
                  >
                    接受
                  </Button>
                </div>
              </div>
            ))}
            
            {/* 折叠状态下显示其他通知数量 */}
            {!notificationExpanded && transferNotifications.length > 1 && (
              <div 
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f8f9fa',
                  borderTop: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => setNotificationExpanded(true)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e9ecef';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
              >
                <Text 
                  type="secondary" 
                  style={{ 
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4
                  }}
                >
                  还有 {transferNotifications.length - 1} 个转接申请
                  <span style={{ fontSize: '10px' }}>▼</span>
                </Text>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>;
};
export default CustomerServiceWorkspace;