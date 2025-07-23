import React from 'react';
import CustomerServiceWorkspace from '../components/CustomerServiceWorkspace';
import { OnlineStatus } from '../components/TopNavigationBar';

interface IndexProps {
  onlineStatus: OnlineStatus;
}

const Index: React.FC<IndexProps> = ({ onlineStatus }) => {
  return <CustomerServiceWorkspace onlineStatus={onlineStatus} />;
};

export default Index;
