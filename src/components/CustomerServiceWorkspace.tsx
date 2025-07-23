import React, { useState } from 'react';
import { Layout, Tabs, List, Avatar, Badge, Button, Input, Space, Tag, Collapse, Typography, Divider, Upload, Modal, Image, Timeline, Tooltip, Popover } from 'antd';
import { MessageOutlined, PhoneOutlined, FileTextOutlined, UserOutlined, SearchOutlined, PictureOutlined, SmileOutlined, SendOutlined, SwapOutlined, CopyOutlined, ExpandOutlined } from '@ant-design/icons';
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
const CustomerServiceWorkspace: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<string>('waiting');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [historyModalVisible, setHistoryModalVisible] = useState<boolean>(false);
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
            <Button icon={<SwapOutlined />}>转接</Button>
            <Button icon={<PhoneOutlined />}>外呼</Button>
            <Button icon={<FileTextOutlined />} type="primary">
              新建工单
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
            <TextArea value={inputMessage} onChange={e => setInputMessage(e.target.value)} placeholder="请输入消息..." autoSize={{
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
          <Panel header="客户信息" key="customer">
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
                <Text>138****8888</Text>
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
                <Text type="secondary">备注：</Text>
                <TextArea placeholder="添加客户备注..." rows={3} />
              </div>
            </div>
          </Panel>

          <Panel header="应用与日志" key="app">
            <div className="app-logs">
              <Title level={5}>RPA应用包</Title>
              <List size="small" dataSource={['财务报表自动化', '数据采集流程', '邮件处理机器人']} renderItem={item => <List.Item>
                    <Button type="link" size="small">
                      {item}
                    </Button>
                  </List.Item>} />
              
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

          <Panel header="服务历史" key="history">
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

          <Panel header="更多信息" key="moreInfo">
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
                <Text>https://boss.shadow-rpa.net/simple/appStudio/app/807803110861266944/%E4%BC%81%E4%B8%9A%E8%AF%A6%E6%83%85/OrgDetailPage?organizationUuid=33aebb43-cc64-11ed-91ab-0242ac1b0002</Text>
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
    </Layout>;
};
export default CustomerServiceWorkspace;