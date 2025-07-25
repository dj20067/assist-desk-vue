import { Layout } from 'antd';
import AppointmentTicketWorkspace from '../components/AppointmentTicketWorkspace';
import { OnlineStatus } from '../components/TopNavigationBar';

const { Content } = Layout;

interface AppointmentTicketProps {
  onlineStatus: OnlineStatus;
}

const AppointmentTicket = ({ onlineStatus }: AppointmentTicketProps) => {
  return (
    <Content style={{ height: '100%', overflow: 'hidden' }}>
      <AppointmentTicketWorkspace onlineStatus={onlineStatus} />
    </Content>
  );
};

export default AppointmentTicket;