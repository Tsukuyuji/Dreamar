import Sidebar from '@/components/layout/Sidebar';
import { ReactNode } from 'react';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64 flex-1 p-8 overflow-y-auto h-screen">
        {children}
      </div>
    </div>
  );
}
