import React from 'react';
import { CheckCircle, XCircle, Clock, Send } from 'lucide-react';
import { Offer } from '../../types/recruitment';
import { format } from 'date-fns';

interface OfferTimelineProps {
  offers: Offer[];
}

const OfferTimeline = ({ offers }: OfferTimelineProps) => {
  const sortedOffers = [...offers].sort((a, b) => 
    new Date(b.sentAt || b.expiresAt).getTime() - new Date(a.sentAt || a.expiresAt).getTime()
  );

  const getStatusIcon = (status: Offer['status']) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'sent':
        return <Send className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {sortedOffers.map((offer, index) => (
          <li key={offer.id}>
            <div className="relative pb-8">
              {index !== sortedOffers.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center ring-8 ring-white">
                    {getStatusIcon(offer.status)}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      Offer {offer.status} - {offer.salary}
                    </p>
                    {offer.benefits.length > 0 && (
                      <p className="mt-1 text-xs text-gray-500">
                        Including {offer.benefits.length} benefits
                      </p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    {offer.sentAt ? (
                      <time dateTime={offer.sentAt}>
                        {format(new Date(offer.sentAt), 'MMM d, yyyy')}
                      </time>
                    ) : (
                      <span>Draft</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OfferTimeline;