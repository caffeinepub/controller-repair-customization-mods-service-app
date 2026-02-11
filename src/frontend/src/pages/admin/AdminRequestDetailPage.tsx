import { useState, useEffect } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BrandCard from '@/components/BrandCard';
import RequestStatusTimeline from '@/components/RequestStatusTimeline';
import NotesPanel from '@/components/admin/NotesPanel';
import FormField from '@/components/FormField';
import { Input } from '@/components/ui/input';
import { useFullServiceRequest, useUpdateRequestStatus, useUpdatePriceEstimate } from '@/hooks/useQueries';
import { RequestStatus } from '@/backend';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { getStatusLabel, getStatusVariant } from '@/lib/statusUtils';
import { toast } from 'sonner';

export default function AdminRequestDetailPage() {
  const { requestId } = useParams({ from: '/admin/request/$requestId' });
  const { data: request, isLoading } = useFullServiceRequest(requestId);
  const updateStatus = useUpdateRequestStatus();
  const updatePrice = useUpdatePriceEstimate();

  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | null>(null);
  const [priceEstimate, setPriceEstimate] = useState('');
  const [priceChanged, setPriceChanged] = useState(false);

  useEffect(() => {
    if (request) {
      // Initialize price estimate from totalPriceEstimate or priceEstimate
      const initialPrice = request.totalPriceEstimate || request.priceEstimate || '';
      setPriceEstimate(initialPrice);
    }
  }, [request]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto px-4 py-12">
        <BrandCard>
          <div className="p-12 text-center">
            <p className="text-muted-foreground">Request not found.</p>
            <Button asChild className="mt-4">
              <Link to="/admin">Back to Requests</Link>
            </Button>
          </div>
        </BrandCard>
      </div>
    );
  }

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;

    try {
      await updateStatus.mutateAsync({
        requestId: BigInt(requestId),
        newStatus: selectedStatus,
      });
      toast.success('Status updated successfully');
      setSelectedStatus(null);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const handlePriceUpdate = async () => {
    try {
      await updatePrice.mutateAsync({
        requestId: BigInt(requestId),
        priceEstimate: priceEstimate.trim() || null,
      });
      toast.success('Price estimate updated successfully');
      setPriceChanged(false);
    } catch (error) {
      console.error('Failed to update price:', error);
      toast.error('Failed to update price estimate');
    }
  };

  const handlePriceChange = (value: string) => {
    setPriceEstimate(value);
    const currentPrice = request.totalPriceEstimate || request.priceEstimate || '';
    setPriceChanged(value !== currentPrice);
  };

  const displayedEstimate = request.totalPriceEstimate || request.priceEstimate;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Requests
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <BrandCard>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Request #{request.id.toString()}</h1>
                  <p className="text-muted-foreground">{request.customerName}</p>
                </div>
                <Badge variant={getStatusVariant(request.status)}>
                  {getStatusLabel(request.status)}
                </Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{request.contactInfo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">
                    {new Date(Number(request.submittedTime) / 1000000).toLocaleString()}
                  </p>
                </div>
              </div>

              {request.servicesRequested && request.servicesRequested.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Selected Services</p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <ul className="space-y-1">
                      {request.servicesRequested.map((service, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-primary mr-2">•</span>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
                  {request.description}
                </p>
              </div>

              {displayedEstimate && displayedEstimate !== '$0' && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Current Estimate</p>
                  <p className="text-2xl font-bold text-primary">{displayedEstimate}</p>
                </div>
              )}
            </div>
          </BrandCard>

          <BrandCard>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-6">Status Timeline</h3>
              <RequestStatusTimeline
                currentStatus={request.status}
                statusHistory={request.statusHistory}
              />
            </div>
          </BrandCard>

          <NotesPanel
            requestId={BigInt(requestId)}
            publicNotes={request.publicNotes}
            internalNotes={request.internalNotes}
          />
        </div>

        <div className="space-y-6">
          <BrandCard>
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold">Update Status</h3>
              <FormField label="New Status">
                <Select
                  value={selectedStatus || request.status}
                  onValueChange={(value) => setSelectedStatus(value as RequestStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
              </FormField>
              <Button
                onClick={handleStatusUpdate}
                disabled={!selectedStatus || selectedStatus === request.status || updateStatus.isPending}
                className="w-full"
              >
                {updateStatus.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Status
                  </>
                )}
              </Button>
            </div>
          </BrandCard>

          <BrandCard>
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold">Price Estimate</h3>
              <FormField
                label="Estimate"
                helperText="Visible to customer (updates via notes)"
              >
                <Input
                  value={priceEstimate}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="e.g., $50-75"
                />
              </FormField>
              <Button
                onClick={handlePriceUpdate}
                disabled={!priceChanged || updatePrice.isPending}
                className="w-full"
              >
                {updatePrice.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Estimate
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Note: Price updates are currently display-only. Use notes to communicate changes to customers.
              </p>
            </div>
          </BrandCard>
        </div>
      </div>
    </div>
  );
}
