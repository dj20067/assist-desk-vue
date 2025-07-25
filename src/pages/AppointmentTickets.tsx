import React from 'react';
import AppointmentTicketWorkspace from '../components/AppointmentTicketWorkspace';
import { OnlineStatus } from '../components/TopNavigationBar';

interface AppointmentTicketsProps {
  onlineStatus: OnlineStatus;
}

const AppointmentTickets: React.FC<AppointmentTicketsProps> = ({ onlineStatus }) => {
  return <AppointmentTicketWorkspace onlineStatus={onlineStatus} />;
};

export default AppointmentTickets;