import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Input, Select, List, Button, Badge, Typography, Space, Modal, Form, Card, Collapse, Avatar, Tag, Tooltip } from 'antd';
import { SearchOutlined, FilterOutlined, CalendarOutlined, UserOutlined, ClockCircleOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { OnlineStatus } from './TopNavigationBar';
import './AppointmentTicketWorkspace.less';

const { Sider, Content } = Layout;
const { TabPane } = Tabs;
const { Text, Title } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

// 工单接口定义
interface TicketItem {
  id: string;
  title: string;
  submitter: string;
  submitterAvatar?: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdTime: string;
  lastUpdatedTime: string;
  description: string;
  category: string;
  assignee?: string;
  tags: string[];
}

interface AppointmentTicketWorkspaceProps {
  onlineStatus: OnlineStatus;
}

const AppointmentTicketWorkspace: React.FC<AppointmentTicketWorkspaceProps> = ({ onlineStatus }) => {
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [ticketDetailModal, setTicketDetailModal] = useState<boolean>(false);
  const [responseModal, setResponseModal] = useState<boolean>(false);
  
  // 模拟工单数据
  const mockTickets: TicketItem[] = [
    {
      id: 'T001',
      title: '预约系统无法访问',
      submitter: '张三',
      submitterAvatar: '',
      status: 'pending',
      priority: 'high',
      createdTime: '2024-01-15 09:30:00',
      lastUpdatedTime: '2024-01-15 09:30:00',
      description: '用户反馈预约系统页面无法正常加载，显示500错误',
      category: '技术问题',
      tags: ['系统故障', '紧急']
    },
    {
      id: 'T002',
      title: '预约时间冲突问题',
      submitter: '李四',
      submitterAvatar: '',
      status: 'in-progress',
      priority: 'medium',
      createdTime: '2024-01-15 08:15:00',
      lastUpdatedTime: '2024-01-15 10:20:00',
      description: '多个用户预约了同一时间段，需要处理冲突',
      category: '业务问题',
      assignee: '王五',
      tags: ['预约冲突', '业务']
    },
    {
      id: 'T003',
      title: '取消预约功能异常',
      submitter: '赵六',
      submitterAvatar: '',
      status: 'resolved',
      priority: 'low',
      createdTime: '2024-01-14 16:45:00',
      lastUpdatedTime: '2024-01-15 11:30:00',
      description: '用户点击取消预约后，状态未正确更新',
      category: '功能问题',
      assignee: '孙七',
      tags: ['功能异常']
    }
  ];

  // 根据状态过滤工单
  const filterTicketsByStatus = (status: string) => {
    return mockTickets.filter(ticket => {
      const statusMatch = status === 'all' || ticket.status === status;
      const searchMatch = searchTerm === '' || 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.submitter.toLowerCase().includes(searchTerm.toLowerCase());
      const priorityMatch = filterPriority === 'all' || ticket.priority === filterPriority;
      
      return statusMatch && searchMatch && priorityMatch;
    });
  };

  // 获取状态显示文本
  const getStatusText = (status: string) => {
    const statusMap = {
      'pending': '待处理',
      'in-progress': '处理中',
      'resolved': '已解决',
      'closed': '已关闭'
    };
    return statusMap[status] || status;
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    const colorMap = {
      'pending': 'orange',
      'in-progress': 'blue',
      'resolved': 'green',
      'closed': 'gray'
    };
    return colorMap[status] || 'default';
  };

  // 获取优先级显示文本
  const getPriorityText = (priority: string) => {
    const priorityMap = {
      'low': '低',
      'medium': '中',
      'high': '高',
      'urgent': '紧急'
    };
    return priorityMap[priority] || priority;
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    const colorMap = {
      'low': 'green',
      'medium': 'blue',
      'high': 'orange',
      'urgent': 'red'
    };
    return colorMap[priority] || 'default';
  };

  // 格式化时间
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  };

  // 渲染工单列表项
  const renderTicketItem = (ticket: TicketItem) => (
    <List.Item
      key={ticket.id}
      className={`ticket-item ${selectedTicket?.id === ticket.id ? 'active' : ''}`}
      onClick={() => setSelectedTicket(ticket)}
    >
      <div className="ticket-content">
        <div className="ticket-header">
          <Text strong className="ticket-title">{ticket.title}</Text>
          <Space>
            <Badge 
              color={getPriorityColor(ticket.priority)} 
              text={getPriorityText(ticket.priority)}
            />
            <Tag color={getStatusColor(ticket.status)}>
              {getStatusText(ticket.status)}
            </Tag>
          </Space>
        </div>
        <div className="ticket-meta">
          <Space split={<span className="divider">|</span>}>
            <span><UserOutlined /> {ticket.submitter}</span>
            <span><ClockCircleOutlined /> {formatTime(ticket.lastUpdatedTime)}</span>
            <span>#{ticket.id}</span>
          </Space>
        </div>
        {ticket.assignee && (
          <div className="ticket-assignee">
            <Text type="secondary">负责人: {ticket.assignee}</Text>
          </div>
        )}
      </div>
    </List.Item>
  );

  return (
    <Layout className="appointment-ticket-workspace">
      {/* 工单列表侧边栏 */}
      <Sider width={350} className="ticket-sidebar">
        <div className="sidebar-header">
          <Title level={4}>工单管理</Title>
          <Space className="search-filter">
            <Input
              placeholder="搜索工单..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
            <Select
              value={filterPriority}
              onChange={setFilterPriority}
              style={{ width: 100 }}
              suffixIcon={<FilterOutlined />}
            >
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="urgent">紧急</Select.Option>
              <Select.Option value="high">高</Select.Option>
              <Select.Option value="medium">中</Select.Option>
              <Select.Option value="low">低</Select.Option>
            </Select>
          </Space>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} className="ticket-tabs">
          <TabPane tab={`待处理 (${filterTicketsByStatus('pending').length})`} key="pending">
            <List
              className="ticket-list"
              dataSource={filterTicketsByStatus('pending')}
              renderItem={renderTicketItem}
            />
          </TabPane>
          <TabPane tab={`处理中 (${filterTicketsByStatus('in-progress').length})`} key="in-progress">
            <List
              className="ticket-list"
              dataSource={filterTicketsByStatus('in-progress')}
              renderItem={renderTicketItem}
            />
          </TabPane>
          <TabPane tab={`已完成 (${filterTicketsByStatus('resolved').length + filterTicketsByStatus('closed').length})`} key="completed">
            <List
              className="ticket-list"
              dataSource={[...filterTicketsByStatus('resolved'), ...filterTicketsByStatus('closed')]}
              renderItem={renderTicketItem}
            />
          </TabPane>
        </Tabs>
      </Sider>

      {/* 工单详情内容区 */}
      <Content className="ticket-content">
        {selectedTicket ? (
          <div className="ticket-detail">
            <div className="ticket-detail-header">
              <div className="header-left">
                <Title level={3}>{selectedTicket.title}</Title>
                <Space>
                  <Tag color={getStatusColor(selectedTicket.status)}>
                    {getStatusText(selectedTicket.status)}
                  </Tag>
                  <Badge 
                    color={getPriorityColor(selectedTicket.priority)} 
                    text={`${getPriorityText(selectedTicket.priority)}优先级`}
                  />
                  <Text type="secondary">#{selectedTicket.id}</Text>
                </Space>
              </div>
              <div className="header-actions">
                <Space>
                  <Button 
                    type="primary" 
                    icon={<CheckCircleOutlined />}
                    onClick={() => setResponseModal(true)}
                  >
                    处理工单
                  </Button>
                  <Button onClick={() => setTicketDetailModal(true)}>
                    详细信息
                  </Button>
                </Space>
              </div>
            </div>

            <div className="ticket-detail-content">
              <Card title="工单详情" className="detail-card">
                <div className="ticket-info">
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Text strong>描述：</Text>
                      <div className="description-content">
                        {selectedTicket.description}
                      </div>
                    </div>
                    <div>
                      <Text strong>分类：</Text> {selectedTicket.category}
                    </div>
                    <div>
                      <Text strong>提交者：</Text> {selectedTicket.submitter}
                    </div>
                    {selectedTicket.assignee && (
                      <div>
                        <Text strong>负责人：</Text> {selectedTicket.assignee}
                      </div>
                    )}
                    <div>
                      <Text strong>创建时间：</Text> {selectedTicket.createdTime}
                    </div>
                    <div>
                      <Text strong>最后更新：</Text> {selectedTicket.lastUpdatedTime}
                    </div>
                    {selectedTicket.tags.length > 0 && (
                      <div>
                        <Text strong>标签：</Text>
                        <Space wrap>
                          {selectedTicket.tags.map(tag => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </Space>
                      </div>
                    )}
                  </Space>
                </div>
              </Card>

              <Card title="处理历史" className="history-card">
                <div className="processing-history">
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div className="history-item">
                      <Avatar size="small" icon={<UserOutlined />} />
                      <div className="history-content">
                        <Text strong>系统</Text>
                        <Text type="secondary" className="history-time">{selectedTicket.createdTime}</Text>
                        <div>工单已创建</div>
                      </div>
                    </div>
                    {selectedTicket.status !== 'pending' && (
                      <div className="history-item">
                        <Avatar size="small" icon={<UserOutlined />} />
                        <div className="history-content">
                          <Text strong>{selectedTicket.assignee || '客服'}</Text>
                          <Text type="secondary" className="history-time">{selectedTicket.lastUpdatedTime}</Text>
                          <div>开始处理工单</div>
                        </div>
                      </div>
                    )}
                  </Space>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="no-ticket-selected">
            <div className="empty-state">
              <CalendarOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
              <Title level={4} type="secondary">请选择一个工单</Title>
              <Text type="secondary">从左侧列表中选择工单以查看详细信息</Text>
            </div>
          </div>
        )}
      </Content>

      {/* 工单详细信息模态框 */}
      <Modal
        title="工单详细信息"
        open={ticketDetailModal}
        onCancel={() => setTicketDetailModal(false)}
        footer={[
          <Button key="close" onClick={() => setTicketDetailModal(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {selectedTicket && (
          <div className="ticket-detail-modal">
            <Collapse defaultActiveKey={['1', '2']}>
              <Panel header="基本信息" key="1">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div><strong>工单ID：</strong>{selectedTicket.id}</div>
                  <div><strong>标题：</strong>{selectedTicket.title}</div>
                  <div><strong>状态：</strong>
                    <Tag color={getStatusColor(selectedTicket.status)}>
                      {getStatusText(selectedTicket.status)}
                    </Tag>
                  </div>
                  <div><strong>优先级：</strong>
                    <Badge 
                      color={getPriorityColor(selectedTicket.priority)} 
                      text={getPriorityText(selectedTicket.priority)}
                    />
                  </div>
                  <div><strong>分类：</strong>{selectedTicket.category}</div>
                </Space>
              </Panel>
              <Panel header="人员信息" key="2">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div><strong>提交者：</strong>{selectedTicket.submitter}</div>
                  <div><strong>负责人：</strong>{selectedTicket.assignee || '未分配'}</div>
                </Space>
              </Panel>
            </Collapse>
          </div>
        )}
      </Modal>

      {/* 处理工单模态框 */}
      <Modal
        title="处理工单"
        open={responseModal}
        onCancel={() => setResponseModal(false)}
        onOk={() => setResponseModal(false)}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="处理状态">
            <Select defaultValue="in-progress">
              <Select.Option value="in-progress">处理中</Select.Option>
              <Select.Option value="resolved">已解决</Select.Option>
              <Select.Option value="closed">关闭工单</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="处理备注">
            <TextArea rows={4} placeholder="请输入处理备注..." />
          </Form.Item>
          <Form.Item label="分配给">
            <Select placeholder="选择负责人">
              <Select.Option value="王五">王五</Select.Option>
              <Select.Option value="孙七">孙七</Select.Option>
              <Select.Option value="周八">周八</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AppointmentTicketWorkspace;