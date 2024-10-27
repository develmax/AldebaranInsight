import React from 'react';
import { Calendar, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Offer } from '../../types/recruitment';
import { format } from 'date-fns';

interface OfferCardProps {
  offer: Offer;
  onAccept?: () => void;
  onReject?: () => void;
}

const OfferCard = ({ offer, onAccept, onReject }: OfferCardProps) => {
  const statusStyles = {
    draft: 'bg-gray-50 text-gray-700',
    sent: 'bg-blue-50 text-blue-700',
    accepted: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-700',
    negotiating: 'bg-yellow-50 text-yellow-700',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Job Offer</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[offer.status]}`}>
          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center text-gray-600">
          <DollarSign className="h-5 w-5 mr-2" />
          {offer.salary}
        </div>

        <div className="flex items-center text-gray-600">
          <Calendar className="h-5 w-5 mr-2" />
          Start Date: {format(new Date(offer.startDate), 'MMMM d, yyyy')}
        </div>

        <div className="flex items-center text-gray-600">
          <Clock className="h-5 w-5 mr-2" />
          Expires: {format(new Date(offer.expiresAt), 'MMMM d, yyyy')}
        </div>

        {offer.benefits.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {offer.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {offer.status === 'sent' && (
          <div className="flex items-center gap-3 pt-4 border-t">
            <button
              onClick={onAccept}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Accept Offer
            </button>
            <button
              onClick={onReject}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle className="h-5 w-5 mr-2" />
              Reject Offer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferCard;