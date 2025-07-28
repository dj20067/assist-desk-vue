import React, { useState } from 'react';
import { Layout, Collapse, Typography, Tag, Divider, Input, Button, List, Timeline, Tooltip } from 'antd';
import { UserOutlined, PhoneOutlined, SettingOutlined, HistoryOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';

const { Sider } = Layout;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Text, Title } = Typography;

interface InfoSidebarProps {
  customerNotes: string;
  notesSaveStatus: string;
  onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onNotesBlur: () => void;
  onHistoryItemClick: (item: any) => void;
  className?: string;
  width?: string | number;
}

const InfoSidebar: React.FC<InfoSidebarProps> = ({
  customerNotes,
  notesSaveStatus,
  onNotesChange,
  onNotesBlur,
  onHistoryItemClick,
  className = "info-sidebar",
  width = "30%"
}) => {
  return (
    <Sider width={width} className={className}>
      <Collapse defaultActiveKey={['customer', 'app', 'history', 'moreInfo']} ghost>
        <Panel header={<div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <UserOutlined style={{
            color: "#1890ff"
          }} />
          <span>客户信息</span>
        </div>} key="customer">
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
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <Text>138****8888</Text>
                <PhoneOutlined style={{
                  color: '#1890ff',
                  fontSize: '16px',
                  cursor: 'pointer'
                }} onClick={() => {
                  // 直接触发呼叫，不显示完整号码
                  window.dispatchEvent(new CustomEvent('directCall', {
                    detail: {
                      phone: '13888888888',
                      name: '张小明'
                    }
                  }));
                }} />
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
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 4
              }}>
                <Text type="secondary">备注：</Text>
                {notesSaveStatus && <Text style={{
                  fontSize: '12px',
                  color: '#52c41a'
                }}>{notesSaveStatus}</Text>}
              </div>
              <TextArea placeholder="添加客户备注..." rows={3} value={customerNotes} onChange={onNotesChange} onBlur={onNotesBlur} />
            </div>
          </div>
        </Panel>

        <Panel header={<div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <SettingOutlined style={{
            color: "#52c41a"
          }} />
          <span>应用与日志</span>
        </div>} key="app">
          <div className="app-logs">
            <Title level={5}>RPA应用包</Title>
            <List size="small" dataSource={[{
              name: '财务报表自动化',
              topic: '816837894440828928'
            }, {
              name: '数据采集流程',
              topic: '817228490332155904'
            }, {
              name: '邮件处理机器人',
              topic: '817659086224482816'
            }]} renderItem={item => <List.Item style={{
              padding: 0
            }}>
              <div className="app-item" style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid transparent'
              }} onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f0f8ff';
                e.currentTarget.style.borderColor = '#1890ff';
                e.currentTarget.style.transform = 'translateX(2px)';
              }} onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
              }} onClick={() => {
                window.open(`shadowbot:Homework?topic-uuid=${item.topic}&model=0`, '_blank');
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#52c41a',
                  flexShrink: 0
                }} />
                <Text style={{
                  color: '#1890ff',
                  fontWeight: 500,
                  fontSize: '13px'
                }}>
                  {item.name}
                </Text>
              </div>
            </List.Item>} />
            
            <Divider />
            
            <div className="log-search">
              <Input placeholder="搜索日志..." prefix={<SearchOutlined />} style={{
                marginBottom: 16
              }} />
              <div className="log-list">
                <Timeline className="mt-4 pt-4">
                  <Timeline.Item color="blue" className="py-[15px]">
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

        <Panel header={<div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <HistoryOutlined style={{
            color: "#faad14"
          }} />
          <span>服务历史</span>
        </div>} key="history">
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
            }} onClick={() => onHistoryItemClick(item)}>
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

        <Panel header={<div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <InfoCircleOutlined style={{
            color: "#722ed1"
          }} />
          <span>更多信息</span>
        </div>} key="moreInfo">
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
              <Button type="link" size="small" href="https://boss.shadow-rpa.net/simple/appStudio/app/807803110861266944/%E4%BC%81%E4%B8%9A%E8%AF%A6%E6%83%85/OrgDetailPage?organizationUuid=33aebb43-cc64-11ed-91ab-0242ac1b0002" target="_blank" style={{
                padding: 0,
                height: 'auto'
              }}>
                查看
              </Button>
            </div>
          </div>
        </Panel>
      </Collapse>
    </Sider>
  );
};

export default InfoSidebar;