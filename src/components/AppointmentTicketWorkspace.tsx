import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  List, 
  Input, 
  Select, 
  Button, 
  Card, 
  Avatar, 
  Badge, 
  Tag, 
  Timeline, 
  Tabs, 
  Collapse, 
  Space,
  Tooltip,
  message,
  Modal,
  Upload,
  Dropdown,
  Form,
  Radio
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  SendOutlined, 
  PaperClipOutlined, 
  SmileOutlined,
  MoreOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  EditOutlined,
  TagOutlined
} from '@ant-design/icons';
import { OnlineStatus } from './TopNavigationBar';
import InfoSidebar, { InfoPanelItem } from './InfoSidebar';
import './AppointmentTicketWorkspace.less';

const { Sider, Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { TabPane } = Tabs;

// 数据类型定义
interface TicketItem {
  id: string;
  title: string;
  submitter: {
    name: string;
    avatar?: string;
    email: string;
    phone: string;
  };
  status: 'new' | 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
  description: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

interface Communication {
  id: string;
  type: 'public_reply' | 'internal_note' | 'status_change' | 'assignment_change';
  content: string;
  author: {
    name: string;
    avatar?: string;
    role: 'agent' | 'customer' | 'system';
  };
  timestamp: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  mentions?: string[];
}

interface AppointmentTicketWorkspaceProps {
  onlineStatus: OnlineStatus;
}

const AppointmentTicketWorkspace: React.FC<AppointmentTicketWorkspaceProps> = ({ onlineStatus }) => {
  // 状态管理
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [replyContent, setReplyContent] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [replyType, setReplyType] = useState<'public' | 'internal'>('public');

  // 模拟数据
  useEffect(() => {
    const mockTickets: TicketItem[] = [
      {
        id: 'TK-001',
        title: '预约系统登录问题',
        submitter: {
          name: '张三',
          avatar: '/api/placeholder/32/32',
          email: 'zhangsan@example.com',
          phone: '138-0001-2345'
        },
        status: 'open',
        priority: 'high',
        category: '技术支持',
        tags: ['登录', '系统'],
        createdAt: '2024-01-15 09:30',
        updatedAt: '2024-01-15 14:20',
        assignee: {
          name: '李工程师',
          avatar: '/api/placeholder/32/32'
        },
        description: '用户反馈无法登录预约系统，提示密码错误，但密码确认无误。',
        attachments: [
          {
            name: '错误截图.png',
            url: '/api/placeholder/400/300',
            type: 'image'
          }
        ]
      },
      {
        id: 'TK-002',
        title: '预约时间冲突问题',
        submitter: {
          name: '李四',
          avatar: '/api/placeholder/32/32',
          email: 'lisi@example.com',
          phone: '138-0002-3456'
        },
        status: 'pending',
        priority: 'medium',
        category: '业务咨询',
        tags: ['预约', '时间冲突'],
        createdAt: '2024-01-15 10:15',
        updatedAt: '2024-01-15 15:45',
        description: '预约了上午10点的服务，但系统显示该时间段已被占用。',
      },
      {
        id: 'TK-003',
        title: '取消预约无法退款',
        submitter: {
          name: '王五',
          avatar: '/api/placeholder/32/32',
          email: 'wangwu@example.com',
          phone: '138-0003-4567'
        },
        status: 'new',
        priority: 'urgent',
        category: '退款问题',
        tags: ['退款', '取消预约'],
        createdAt: '2024-01-15 11:00',
        updatedAt: '2024-01-15 11:00',
        description: '因个人原因需要取消明天的预约，但系统不允许退款。',
      }
    ];

    const mockCommunications: Communication[] = [
      {
        id: 'comm-1',
        type: 'public_reply',
        content: '您好，我们已经收到您的问题报告。我们的技术团队正在调查登录问题，预计会在2小时内给您回复。',
        author: {
          name: '李工程师',
          avatar: '/api/placeholder/32/32',
          role: 'agent'
        },
        timestamp: '2024-01-15 10:00'
      },
      {
        id: 'comm-2',
        type: 'internal_note',
        content: '已联系开发团队，可能是新版本更新导致的认证问题。',
        author: {
          name: '李工程师',
          avatar: '/api/placeholder/32/32',
          role: 'agent'
        },
        timestamp: '2024-01-15 10:30'
      },
      {
        id: 'comm-3',
        type: 'status_change',
        content: '工单状态从 "新建" 更改为 "处理中"',
        author: {
          name: '系统',
          role: 'system'
        },
        timestamp: '2024-01-15 11:00'
      }
    ];

    setTickets(mockTickets);
    setCommunications(mockCommunications);
    setSelectedTicket(mockTickets[0]);
  }, []);

  // 过滤工单
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.submitter.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // 状态颜色映射
  const getStatusColor = (status: string) => {
    const colors = {
      'new': '#ff4d4f',
      'open': '#1890ff',
      'pending': '#faad14',
      'resolved': '#52c41a',
      'closed': '#8c8c8c'
    };
    return colors[status as keyof typeof colors] || '#8c8c8c';
  };

  // 优先级颜色映射
  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': '#52c41a',
      'medium': '#faad14',
      'high': '#ff7a45',
      'urgent': '#ff4d4f'
    };
    return colors[priority as keyof typeof colors] || '#8c8c8c';
  };

  // 发送回复
  const handleSendReply = () => {
    if (!replyContent.trim()) return;
    
    const newCommunication: Communication = {
      id: `comm-${Date.now()}`,
      type: replyType === 'public' ? 'public_reply' : 'internal_note',
      content: replyContent,
      author: {
        name: '当前用户',
        role: 'agent'
      },
      timestamp: new Date().toLocaleString()
    };

    setCommunications([...communications, newCommunication]);
    setReplyContent('');
    message.success(replyType === 'public' ? '公开回复已发送' : '内部备注已添加');
  };

  // 更新工单状态
  const handleStatusChange = (newStatus: string) => {
    if (!selectedTicket) return;
    
    const updatedTicket = { ...selectedTicket, status: newStatus as any };
    setSelectedTicket(updatedTicket);
    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    
    const statusChangeComm: Communication = {
      id: `comm-${Date.now()}`,
      type: 'status_change',
      content: `工单状态从 "${selectedTicket.status}" 更改为 "${newStatus}"`,
      author: {
        name: '系统',
        role: 'system'
      },
      timestamp: new Date().toLocaleString()
    };
    
    setCommunications([...communications, statusChangeComm]);
    message.success('工单状态已更新');
  };

  // 生成预约工单信息面板配置
  const generateTicketInfoPanels = (): InfoPanelItem[] => {
    if (!selectedTicket) return [];
    
    return [
      {
        key: 'customer',
        header: '客户信息',
        content: (
          <div className="customer-info">
            <div className="customer-header">
              <Avatar size={48} src={selectedTicket.submitter.avatar} icon={<UserOutlined />} />
              <div className="customer-details">
                <h4>{selectedTicket.submitter.name}</h4>
                <p className="customer-email">
                  <MailOutlined /> {selectedTicket.submitter.email}
                </p>
                <p className="customer-phone">
                  <PhoneOutlined /> {selectedTicket.submitter.phone}
                </p>
              </div>
            </div>
          </div>
        )
      },
      {
        key: 'operations',
        header: '工单操作',
        content: (
          <div className="ticket-operations">
            <div className="operation-item">
              <label>状态:</label>
              <Select
                value={selectedTicket.status}
                onChange={handleStatusChange}
                style={{ width: '100%' }}
              >
                <Option value="new">新建</Option>
                <Option value="open">处理中</Option>
                <Option value="pending">等待中</Option>
                <Option value="resolved">已解决</Option>
                <Option value="closed">已关闭</Option>
              </Select>
            </div>

            <div className="operation-item">
              <label>优先级:</label>
              <Select
                value={selectedTicket.priority}
                style={{ width: '100%' }}
              >
                <Option value="low">低</Option>
                <Option value="medium">中</Option>
                <Option value="high">高</Option>
                <Option value="urgent">紧急</Option>
              </Select>
            </div>

            <div className="operation-item">
              <label>分类:</label>
              <Select
                value={selectedTicket.category}
                style={{ width: '100%' }}
              >
                <Option value="技术支持">技术支持</Option>
                <Option value="业务咨询">业务咨询</Option>
                <Option value="退款问题">退款问题</Option>
                <Option value="其他">其他</Option>
              </Select>
            </div>

            <div className="operation-item">
              <label>标签:</label>
              <div className="tags-container">
                {selectedTicket.tags.map((tag, index) => (
                  <Tag key={index} closable>
                    {tag}
                  </Tag>
                ))}
                <Button size="small" icon={<TagOutlined />}>添加标签</Button>
              </div>
            </div>
          </div>
        )
      },
      {
        key: 'info',
        header: '工单信息',
        content: (
          <div className="ticket-meta-info">
            <div className="meta-item">
              <label>创建时间:</label>
              <span>{selectedTicket.createdAt}</span>
            </div>
            <div className="meta-item">
              <label>更新时间:</label>
              <span>{selectedTicket.updatedAt}</span>
            </div>
            {selectedTicket.assignee && (
              <div className="meta-item">
                <label>处理人:</label>
                <Space>
                  <Avatar size="small" src={selectedTicket.assignee.avatar} icon={<UserOutlined />} />
                  <span>{selectedTicket.assignee.name}</span>
                </Space>
              </div>
            )}
          </div>
        )
      }
    ];
  };

  return (
    <Layout className="appointment-ticket-workspace">
      {/* 左侧工单列表 */}
      <Sider className="ticket-sidebar" width={350}>
        <div className="sidebar-header">
          <h3>预约工单</h3>
          <Space>
            <Input
              placeholder="搜索工单..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 150 }}
            />
            <Dropdown
              overlay={
                <div style={{ background: 'white', padding: 16, borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <Space direction="vertical">
                    <div>
                      <label>状态:</label>
                      <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 120, marginLeft: 8 }}>
                        <Option value="all">全部</Option>
                        <Option value="new">新建</Option>
                        <Option value="open">处理中</Option>
                        <Option value="pending">等待中</Option>
                        <Option value="resolved">已解决</Option>
                        <Option value="closed">已关闭</Option>
                      </Select>
                    </div>
                    <div>
                      <label>优先级:</label>
                      <Select value={priorityFilter} onChange={setPriorityFilter} style={{ width: 120, marginLeft: 8 }}>
                        <Option value="all">全部</Option>
                        <Option value="low">低</Option>
                        <Option value="medium">中</Option>
                        <Option value="high">高</Option>
                        <Option value="urgent">紧急</Option>
                      </Select>
                    </div>
                  </Space>
                </div>
              }
              trigger={['click']}
            >
              <Button icon={<FilterOutlined />} />
            </Dropdown>
          </Space>
        </div>
        
        <List
          className="ticket-list"
          dataSource={filteredTickets}
          renderItem={(ticket) => (
            <List.Item
              className={`ticket-item ${selectedTicket?.id === ticket.id ? 'selected' : ''}`}
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="ticket-content">
                <div className="ticket-header">
                  <span className="ticket-id">{ticket.id}</span>
                  <Badge color={getStatusColor(ticket.status)} />
                </div>
                <h4 className="ticket-title">{ticket.title}</h4>
                <div className="ticket-meta">
                  <Space size="small">
                    <Avatar size="small" src={ticket.submitter.avatar} icon={<UserOutlined />} />
                    <span className="submitter-name">{ticket.submitter.name}</span>
                  </Space>
                  <Tag color={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Tag>
                </div>
                <div className="ticket-time">
                  <span>更新: {ticket.updatedAt}</span>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Sider>

      {/* 中间内容区域 */}
      <Content className="ticket-content">
        {selectedTicket ? (
          <div className="ticket-detail">
            <div className="ticket-detail-header">
              <div className="ticket-info">
                <h2>{selectedTicket.title}</h2>
                <Space>
                  <Tag color={getStatusColor(selectedTicket.status)}>{selectedTicket.status}</Tag>
                  <Tag color={getPriorityColor(selectedTicket.priority)}>{selectedTicket.priority}</Tag>
                  <span className="ticket-id">#{selectedTicket.id}</span>
                </Space>
              </div>
            </div>

            <Tabs activeKey={activeTab} onChange={setActiveTab} className="ticket-tabs">
              <TabPane tab="问题详情" key="details">
                <Card title="问题描述" className="problem-description">
                  <p>{selectedTicket.description}</p>
                  {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                    <div className="attachments">
                      <h4>附件:</h4>
                      <Space wrap>
                        {selectedTicket.attachments.map((attachment, index) => (
                          <Button key={index} icon={<PaperClipOutlined />} size="small">
                            {attachment.name}
                          </Button>
                        ))}
                      </Space>
                    </div>
                  )}
                </Card>
              </TabPane>

              <TabPane tab="沟通记录" key="communications">
                <div className="communications-section">
                  <Timeline className="communication-timeline">
                    {communications.map((comm) => (
                      <Timeline.Item
                        key={comm.id}
                        color={comm.type === 'public_reply' ? '#1890ff' : comm.type === 'internal_note' ? '#faad14' : '#52c41a'}
                        dot={
                          comm.type === 'public_reply' ? <MailOutlined /> :
                          comm.type === 'internal_note' ? <EditOutlined /> :
                          <SyncOutlined />
                        }
                      >
                        <div className="communication-item">
                          <div className="comm-header">
                            <Space>
                              <Avatar size="small" src={comm.author.avatar} icon={<UserOutlined />} />
                              <span className="author-name">{comm.author.name}</span>
                              <span className="comm-type">
                                {comm.type === 'public_reply' ? '公开回复' : 
                                 comm.type === 'internal_note' ? '内部备注' : '状态变更'}
                              </span>
                              <span className="timestamp">{comm.timestamp}</span>
                            </Space>
                          </div>
                          <div className="comm-content">{comm.content}</div>
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </div>

                {/* 回复区域 */}
                <Card title="添加回复" className="reply-section">
                  <Radio.Group
                    value={replyType}
                    onChange={(e) => setReplyType(e.target.value)}
                    style={{ marginBottom: 16 }}
                  >
                    <Radio.Button value="public">公开回复</Radio.Button>
                    <Radio.Button value="internal">内部备注</Radio.Button>
                  </Radio.Group>
                  
                  <TextArea
                    rows={4}
                    placeholder={replyType === 'public' ? '输入给客户的回复...' : '输入内部备注...'}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  
                  <div className="reply-actions">
                    <Space>
                      <Button icon={<PaperClipOutlined />}>添加附件</Button>
                      <Button icon={<SmileOutlined />}>表情</Button>
                      <Button 
                        type="primary" 
                        icon={<SendOutlined />}
                        onClick={handleSendReply}
                        disabled={!replyContent.trim()}
                      >
                        发送{replyType === 'public' ? '回复' : '备注'}
                      </Button>
                    </Space>
                  </div>
                </Card>
              </TabPane>
            </Tabs>
          </div>
        ) : (
          <div className="no-ticket-selected">
            <div className="placeholder-content">
              <CalendarOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
              <h3>请选择一个工单</h3>
              <p>从左侧列表中选择一个工单来查看详情</p>
            </div>
          </div>
        )}
      </Content>

      {/* 右侧信息面板 */}
      <InfoSidebar
        panels={generateTicketInfoPanels()}
        defaultActiveKeys={['customer', 'operations', 'info']}
        width={300}
      >
        {!selectedTicket && (
          <div className="no-info">
            <p>选择工单以查看详细信息</p>
          </div>
        )}
      </InfoSidebar>
    </Layout>
  );
};

export default AppointmentTicketWorkspace;