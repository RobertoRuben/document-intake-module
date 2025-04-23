import { ReactNode } from 'react';

export interface LayoutProps {
  children?: ReactNode;
}

export interface LayoutState {
  sidebarOpen: boolean;
  modalOpen: boolean;
  notificationCount: number;
  unconfirmedCount: number;
}