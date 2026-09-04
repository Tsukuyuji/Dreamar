"use client";

import Link from 'next/link';
import { Home, DollarSign, Users, Settings } from 'lucide-react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Vendas', href: '/vendas', icon: DollarSign },
    { name: 'Corretores', href: '/corretores', icon: Users },
    { name: 'Configurações', href: '/configuracoes', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-900 text-white fixed">
      <div className="flex h-16 items-center justify-center border-b border-slate-700">
        <h1 className="text-2xl font-bold text-blue-400">DREAMAR</h1>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center">
            <span className="text-xs">ADM</span>
          </div>
          <div>
            <p className="text-sm font-medium">Administrador</p>
            <p className="text-xs text-slate-400">Gestor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
