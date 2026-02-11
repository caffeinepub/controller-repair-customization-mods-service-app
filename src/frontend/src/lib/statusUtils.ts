import { RequestStatus } from '@/backend';

export function getStatusLabel(status: RequestStatus): string {
  const labels: Record<RequestStatus, string> = {
    [RequestStatus.submitted]: 'Submitted',
    [RequestStatus.inReview]: 'In Review',
    [RequestStatus.accepted]: 'Accepted',
    [RequestStatus.inProgress]: 'In Progress',
    [RequestStatus.waitingForParts]: 'Waiting for Parts',
    [RequestStatus.completed]: 'Completed',
    [RequestStatus.shipped]: 'Shipped',
    [RequestStatus.cancelled]: 'Cancelled',
  };
  return labels[status] || 'Unknown';
}

export function getStatusVariant(status: RequestStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<RequestStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    [RequestStatus.submitted]: 'secondary',
    [RequestStatus.inReview]: 'secondary',
    [RequestStatus.accepted]: 'default',
    [RequestStatus.inProgress]: 'default',
    [RequestStatus.waitingForParts]: 'outline',
    [RequestStatus.completed]: 'default',
    [RequestStatus.shipped]: 'default',
    [RequestStatus.cancelled]: 'destructive',
  };
  return variants[status] || 'secondary';
}
