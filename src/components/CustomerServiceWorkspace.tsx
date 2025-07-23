import React, { useState } from 'react';
import {
  Layout,
  Tabs,
  List,
  Avatar,
  Badge,
  Button,
  Input,
  Space,
  Tag,
  Collapse,
  Typography,
  Divider,
  Upload,
  Modal,
  Image,
  Timeline,
  Tooltip,
  Popover
} from 'antd';
import {
  MessageOutlined,
  PhoneOutlined,
  FileTextOutlined,
  UserOutlined,
  SearchOutlined,
  PictureOutlined,
  SmileOutlined,
  SendOutlined,
  SwapOutlined,
  CopyOutlined,
  ExpandOutlined
} from '@ant-design/icons';
import './CustomerServiceWorkspace.less';

const { Sider, Content } = Layout;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Text, Title } = Typography;

interface ConversationItem {
  id: string;
  userName: string;
  avatar: string;
  lastMessage: string;
  waitTime: number;
  unreadCount: number;
  status: 'waiting' | 'serving' | 'completed';
  priority: 'normal' | 'warning' | 'urgent';
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

  // 常用语数据
  const commonPhrases = [
    {
      category: '问候语',
      phrases: [
        '您好！我是客服小王，很高兴为您服务。',
        '您好，请问有什么可以帮助您的吗？',
        '感谢您的耐心等待，现在为您服务。'
      ]
    },
    {
      category: '技术支持',
      phrases: [
        '请您详细描述一下遇到的问题，我来帮您解决。',
        '我来为您检查一下系统状态，请稍等。',
        '这个问题我需要联系技术人员确认，请稍等片刻。',
        '请您提供一下错误截图，这样我能更好地帮您解决问题。'
      ]
    },
    {
      category: 'RPA相关',
      phrases: [
        '关于RPA流程配置，您可以参考我们的帮助文档。',
        '请确认您的RPA应用包版本是否为最新版本。',
        '这个RPA流程执行失败可能是权限问题，我来帮您检查。'
      ]
    },
    {
      category: '结束语',
      phrases: [
        '问题已经为您解决，还有其他需要帮助的吗？',
        '如果您还有其他问题，随时联系我们。',
        '感谢您的使用，祝您工作愉快！'
      ]
    }
  ];

  // 模拟数据
  const conversations: ConversationItem[] = [
    {
      id: '1',
      userName: '张小明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      lastMessage: '您好，我需要咨询一下RPA流程的问题...',
      waitTime: 180,
      unreadCount: 3,
      status: 'waiting',
      priority: 'normal'
    },
    {
      id: '2',
      userName: '李小红',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      lastMessage: '系统报错了，请帮忙看看',
      waitTime: 240,
      unreadCount: 0,
      status: 'serving',
      priority: 'warning'
    },
    {
      id: '3',
      userName: '王小华',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      lastMessage: '谢谢您的帮助！',
      waitTime: 360,
      unreadCount: 0,
      status: 'serving',
      priority: 'urgent'
    }
  ];

  // 表情符号数据
  const emojiCategories = [
    {
      category: '常用',
      emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚']
    },
    {
      category: '手势',
      emojis: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏']
    },
    {
      category: '工作',
      emojis: ['💼', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '💾', '💿', '📱', '☎️', '📞', '📠', '📧', '📨', '📩', '📤', '📥', '📪', '📫', '📬']
    },
    {
      category: '符号',
      emojis: ['❤️', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️']
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      type: 'text',
      content: '您好，我需要咨询一下RPA流程的问题',
      sender: 'user',
      timestamp: '10:30'
    },
    {
      id: '2',
      type: 'text',
      content: '您好！我是客服小王，很高兴为您服务。请详细描述一下您遇到的问题。',
      sender: 'agent',
      timestamp: '10:31'
    },
    {
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
    }
  ];

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
      // 发送消息逻辑
      console.log('发送消息:', inputMessage);
      setInputMessage('');
    }
  };

  // 插入常用语到输入框
  const handleSelectPhrase = (phrase: string) => {
    const newMessage = inputMessage ? `${inputMessage}\n${phrase}` : phrase;
    setInputMessage(newMessage);
  };

  // 插入表情符号到输入框
  const handleSelectEmoji = (emoji: string) => {
    const newMessage = inputMessage + emoji;
    setInputMessage(newMessage);
  };

  // 渲染表情符号选择面板
  const renderEmojiContent = () => (
    <div style={{ width: 300, maxHeight: 200, overflow: 'auto' }}>
      <Tabs size="small">
        {emojiCategories.map((category, index) => (
          <TabPane tab={category.category} key={index}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(5, 1fr)', 
              gap: '8px',
              padding: '8px 0'
            }}>
              {category.emojis.map((emoji, emojiIndex) => (
                <Button
                  key={emojiIndex}
                  type="text"
                  size="small"
                  style={{ 
                    fontSize: '18px', 
                    height: '32px', 
                    width: '32px',
                    padding: 0,
                    border: 'none'
                  }}
                  onClick={() => handleSelectEmoji(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );

  // 渲染常用语选择面板
  const renderCommonPhrasesContent = () => (
    <div style={{ width: 400, maxHeight: 300, overflow: 'auto' }}>
      <Collapse ghost>
        {commonPhrases.map((category, index) => (
          <Panel header={category.category} key={index}>
            <List
              size="small"
              dataSource={category.phrases}
              renderItem={(phrase) => (
                <List.Item
                  style={{ cursor: 'pointer', padding: '4px 0' }}
                  onClick={() => handleSelectPhrase(phrase)}
                >
                  <Text>{phrase}</Text>
                </List.Item>
              )}
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  );

  const renderConversationItem = (item: ConversationItem) => (
    <List.Item
      key={item.id}
      className={`conversation-item ${getPriorityClass(item.priority)} ${
        selectedConversation === item.id ? 'selected' : ''
      }`}
      onClick={() => setSelectedConversation(item.id)}
    >
      <List.Item.Meta
        avatar={
          <Badge count={item.unreadCount} size="small">
            <Avatar src={item.avatar} />
          </Badge>
        }
        title={
          <div className="conversation-header">
            <Text strong>{item.userName}</Text>
            <Text type="secondary" className="wait-time">
              {formatTime(item.waitTime)}
            </Text>
          </div>
        }
        description={
          <Text type="secondary" ellipsis>
            {item.lastMessage}
          </Text>
        }
      />
    </List.Item>
  );

  const renderMessage = (message: Message) => (
    <div
      key={message.id}
      className={`message ${message.sender === 'agent' ? 'message-agent' : 'message-user'}`}
    >
      <div className="message-content">
        {message.type === 'code' ? (
          <div className="code-block">
            <div className="code-header">
              <span>代码</span>
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => navigator.clipboard.writeText(message.content)}
              />
            </div>
            <pre>{message.content}</pre>
          </div>
        ) : message.type === 'image' ? (
          <Image
            src={message.content}
            alt="图片消息"
            style={{ maxWidth: 200 }}
            preview={{
              onVisibleChange: (visible) => !visible && setPreviewImage('')
            }}
          />
        ) : (
          <Text>{message.content}</Text>
        )}
      </div>
      <div className="message-time">
        <Text type="secondary">
          {message.timestamp}
        </Text>
      </div>
    </div>
  );

  return (
    <Layout className="customer-service-workspace">
      {/* 左侧会话列表 */}
      <Sider width="20%" className="conversation-sidebar">
        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <TabPane tab="待服务" key="waiting">
            <List
              className="conversation-list"
              dataSource={getConversationsByStatus('waiting')}
              renderItem={renderConversationItem}
            />
          </TabPane>
          <TabPane tab="服务中" key="serving">
            <List
              className="conversation-list"
              dataSource={getConversationsByStatus('serving')}
              renderItem={renderConversationItem}
            />
          </TabPane>
          <TabPane tab="已完成" key="completed">
            <List
              className="conversation-list"
              dataSource={getConversationsByStatus('completed')}
              renderItem={renderConversationItem}
            />
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
              <Popover
                content={renderEmojiContent()}
                title="表情符号"
                trigger="click"
                placement="topLeft"
              >
                <Button icon={<SmileOutlined />} type="text" />
              </Popover>
              <Upload showUploadList={false}>
                <Button icon={<PictureOutlined />} type="text" />
              </Upload>
              <Popover
                content={renderCommonPhrasesContent()}
                title="常用语"
                trigger="click"
                placement="topLeft"
              >
                <Button type="text">常用语</Button>
              </Popover>
              <Button type="text">知识库</Button>
            </Space>
          </div>
          <div className="input-area">
            <TextArea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="请输入消息..."
              autoSize={{ minRows: 2, maxRows: 4 }}
              onPressEnter={handleSendMessage}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              className="send-button"
            >
              发送
            </Button>
          </div>
        </div>
      </Content>

      {/* 右侧信息区 */}
      <Sider width="30%" className="info-sidebar">
        <Collapse defaultActiveKey={['customer', 'app', 'history']} ghost>
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
                <div style={{ marginTop: 4 }}>
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
              <List
                size="small"
                dataSource={[
                  '财务报表自动化',
                  '数据采集流程',
                  '邮件处理机器人'
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Button type="link" size="small">
                      {item}
                    </Button>
                  </List.Item>
                )}
              />
              
              <Divider />
              
              <div className="log-search">
                <Input
                  placeholder="搜索日志..."
                  prefix={<SearchOutlined />}
                  style={{ marginBottom: 16 }}
                />
                <div className="log-list">
                  <Timeline>
                    <Timeline.Item color="green">
                      <Text type="secondary">10:30</Text> 流程执行成功
                    </Timeline.Item>
                    <Timeline.Item color="red">
                      <Text type="secondary">10:25</Text> 
                      <Text style={{ color: '#ff4d4f' }}>连接超时错误</Text>
                    </Timeline.Item>
                    <Timeline.Item color="blue">
                      <Text type="secondary">10:20</Text> 开始执行流程
                    </Timeline.Item>
                  </Timeline>
                </div>
              </div>
            </div>
          </Panel>

          <Panel header="服务历史" key="history">
            <div className="service-history">
              <List
                size="small"
                dataSource={[
                  {
                    date: '2024-01-15',
                    summary: 'RPA流程配置问题咨询',
                    status: '已解决'
                  },
                  {
                    date: '2024-01-10',
                    summary: '系统登录异常',
                    status: '已解决'
                  }
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <div className="history-item">
                      <div className="history-date">
                        <Text type="secondary">{item.date}</Text>
                      </div>
                      <div className="history-content">
                        <Text>{item.summary}</Text>
                        <Tag color="green">{item.status}</Tag>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </Panel>
        </Collapse>
      </Sider>
    </Layout>
  );
};

export default CustomerServiceWorkspace;