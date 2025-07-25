import React, { ReactNode } from 'react';
import { Layout, Collapse } from 'antd';
import './InfoSidebar.less';

const { Sider } = Layout;
const { Panel } = Collapse;

export interface InfoPanelItem {
  key: string;
  header: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
}

interface InfoSidebarProps {
  panels: InfoPanelItem[];
  defaultActiveKeys?: string[];
  width?: string | number;
  className?: string;
  children?: ReactNode;
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

const InfoSidebar: React.FC<InfoSidebarProps> = ({
  panels,
  defaultActiveKeys = [],
  width = "30%",
  className = "",
  children,
  collapsed = false,
  onCollapseChange
}) => {
  return (
    <Sider 
      width={width} 
      className={`info-sidebar ${className}`}
      collapsed={collapsed}
      onCollapse={onCollapseChange}
      collapsible
    >
      {children ? (
        children
      ) : (
        <Collapse 
          defaultActiveKey={defaultActiveKeys} 
          ghost
          className="info-panels"
        >
          {panels.map((panel) => (
            <Panel 
              header={panel.header} 
              key={panel.key}
            >
              {panel.content}
            </Panel>
          ))}
        </Collapse>
      )}
    </Sider>
  );
};

export default InfoSidebar;