import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import BrandCard from '@/components/BrandCard';
import { useAllServiceRequests, useServiceRequestsByStatus } from '@/hooks/useQueries';
import { RequestStatus } from '@/backend';
import { Loader2, Eye } from 'lucide-react';
import { getStatusLabel, getStatusVariant } from '@/lib/statusUtils';

export default function AdminRequestsPage() {
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'all'>('all');
  
  const allRequests = useAllServiceRequests();
  const filteredRequests = useServiceRequestsByStatus(
    filterStatus !== 'all' ? filterStatus : null
  );

  const requests = filterStatus === 'all' ? allRequests.data : filteredRequests.data;
  const isLoading = filterStatus === 'all' ? allRequests.isLoading : filteredRequests.isLoading;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Service Requests</h1>
        <p className="text-muted-foreground">
          Manage and track all customer service requests.
        </p>
      </div>

      <BrandCard className="mb-6">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filter by Status:</label>
            <Select
              value={filterStatus}
              onValueChange={(value) => setFilterStatus(value as RequestStatus | 'all')}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value={RequestStatus.submitted}>Submitted</SelectItem>
                <SelectItem value={RequestStatus.inReview}>In Review</SelectItem>
                <SelectItem value={RequestStatus.accepted}>Accepted</SelectItem>
                <SelectItem value={RequestStatus.inProgress}>In Progress</SelectItem>
                <SelectItem value={RequestStatus.waitingForParts}>Waiting for Parts</SelectItem>
                <SelectItem value={RequestStatus.completed}>Completed</SelectItem>
                <SelectItem value={RequestStatus.shipped}>Shipped</SelectItem>
                <SelectItem value={RequestStatus.cancelled}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </BrandCard>

      <BrandCard>
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !requests || requests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id.toString()}>
                      <TableCell className="font-mono">#{request.id.toString()}</TableCell>
                      <TableCell className="font-medium">{request.customerName}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(request.status)}>
                          {getStatusLabel(request.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(Number(request.submittedTime) / 1000000).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(Number(request.lastUpdatedTime) / 1000000).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link
                            to="/admin/request/$requestId"
                            params={{ requestId: request.id.toString() }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </BrandCard>
    </div>
  );
}
