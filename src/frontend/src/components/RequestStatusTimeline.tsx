import { RequestStatus, StatusChange } from '@/backend';
import { getStatusLabel } from '@/lib/statusUtils';
import { CheckCircle2, Circle } from 'lucide-react';

interface RequestStatusTimelineProps {
  currentStatus: RequestStatus;
  statusHistory: StatusChange[];
}

export default function RequestStatusTimeline({
  currentStatus,
  statusHistory,
}: RequestStatusTimelineProps) {
  const sortedHistory = [...statusHistory].sort(
    (a, b) => Number(b.changedTime) - Number(a.changedTime)
  );

  return (
    <div className="space-y-4">
      {sortedHistory.map((change, index) => {
        const isCurrentStatus = change.status === currentStatus;
        const date = new Date(Number(change.changedTime) / 1000000);

        return (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              {isCurrentStatus ? (
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground flex-shrink-0" />
              )}
              {index < sortedHistory.length - 1 && (
                <div className="w-0.5 flex-1 bg-border mt-2" />
              )}
            </div>
            <div className="flex-1 pb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`font-medium ${isCurrentStatus ? 'text-primary' : ''}`}>
                    {getStatusLabel(change.status)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {date.toLocaleDateString()} at {date.toLocaleTimeString()}
                  </p>
                </div>
                {isCurrentStatus && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    Current
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
