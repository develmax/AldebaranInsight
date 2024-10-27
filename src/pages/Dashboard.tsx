import React from 'react';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp,
  Brain,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import RecentActivities from '../components/RecentActivities';
import CandidateProgress from '../components/CandidateProgress';

const StatCard = ({ icon: Icon, label, value, trend }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center">
        <TrendingUp className={`h-4 w-4 ${trend.positive ? 'text-green-500' : 'text-red-500'}`} />
        <span className={`ml-2 text-sm ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
          {trend.value}
        </span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const stats = [
    { icon: Briefcase, label: 'Active Vacancies', value: 24, trend: { value: '+12% this month', positive: true } },
    { icon: Users, label: 'Total Candidates', value: 847, trend: { value: '+28% this month', positive: true } },
    { icon: Calendar, label: 'Scheduled Interviews', value: 38 },
    { icon: CheckCircle, label: 'Successful Placements', value: 156, trend: { value: '+18% this month', positive: true } },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">AI Interview Progress</h2>
            <Brain className="h-5 w-5 text-indigo-600" />
          </div>
          <CandidateProgress />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <MessageSquare className="h-5 w-5 text-indigo-600" />
          </div>
          <RecentActivities />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;