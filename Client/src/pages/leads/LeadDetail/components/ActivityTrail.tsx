import type { LeadActivity } from '@/features/leads';
import { formatDateTime } from '@/shared/utils/dateFormatter';

interface ActivityTrailProps {
  activities: LeadActivity[];
}

const ActivityTrail: React.FC<ActivityTrailProps> = ({ activities }) => {
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-slate-900">Activity</h2>
        {activities.length > 0 && (
          <span className="ml-auto inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            {activities.length}
          </span>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-slate-500">No activities yet</p>
        </div>
      ) : (
        <ol className="space-y-4">
          {sortedActivities.map((activity, index) => (
            <li key={activity._id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                  {(activity.actor?.name.charAt(0) || 'S').toUpperCase()}
                </div>
                {index !== sortedActivities.length - 1 && (
                  <div className="w-0.5 h-8 bg-slate-200 mt-2" />
                )}
              </div>

              <div className="flex-1 pb-2">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                  <p className="text-sm text-slate-800 font-medium">{activity.message}</p>
                  <p className="text-xs text-slate-600 mt-2">
                    <span className="font-medium">{activity.actor?.name || 'System'}</span> ·{' '}
                    {formatDateTime(activity.createdAt, 'MMM D, h:mm A')}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default ActivityTrail;
