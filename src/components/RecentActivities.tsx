import React from 'react';
import { MessageSquare, Calendar, CheckCircle, User, Brain } from 'lucide-react';

const ActivityItem = ({ icon: Icon, title, description, time, type }: {
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
  type: 'message' | 'interview' | 'success' | 'ai' | 'new';
}) => {
  const colors = {
    message: 'text-blue-600 bg-blue-50',
    interview: 'text-purple-600 bg-purple-50',
    success: 'text-green-600 bg-green-50',
    ai: 'text-indigo-600 bg-indigo-50',
    new: 'text-orange-600 bg-orange-50',
  };

  return (
    <div className="flex items-start space-x-4">
      <div className={`p-2 rounded-lg ${colors[type]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <time className="text-sm text-gray-400 whitespace-nowrap">{time}</time>
    </div>
  );
};

const RecentActivities = () => {
  const activities = [
    {
      icon: Brain,
      title: 'AI Interview Completed',
      description: 'AI assessment completed for Frontend Developer position',
      time: '5m ago',
      type: 'ai' as const,
    },
    {
      icon: Calendar,
      title: 'Interview Scheduled',
      description: 'Technical interview with Sarah Chen',
      time: '1h ago',
      type: 'interview' as const,
    },
    {
      icon: User,
      title: 'New Candidate',
      description: 'Michael Rodriguez applied for Product Manager',
      time: '2h ago',
      type: 'new' as const,
    },
    {
      icon: CheckCircle,
      title: 'Offer Accepted',
      description: 'Emily Watson accepted the UX Designer position',
      time: '3h ago',
      type: 'success' as const,
    },
    {
      icon: MessageSquare,
      title: 'AI Chat Initiated',
      description: 'Automated screening chat started with 3 candidates',
      time: '4h ago',
      type: 'message' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {activities.map((activity, index) => (
        <ActivityItem key={index} {...activity} />
      ))}
    </div>
  );
};

export default RecentActivities;