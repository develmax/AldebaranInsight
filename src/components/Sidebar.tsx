import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Calendar,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Briefcase, label: 'Vacancies', path: '/vacancies' },
    { icon: Users, label: 'Candidates', path: '/candidates' },
    { icon: Calendar, label: 'Interviews', path: '/interviews' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 px-4 py-6">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-200">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;