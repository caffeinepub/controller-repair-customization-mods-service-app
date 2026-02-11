import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BrandCard from '@/components/BrandCard';
import FormField from '@/components/FormField';
import RequestStatusTimeline from '@/components/RequestStatusTimeline';
import { useServiceRequestLookup } from '@/hooks/useQueries';
import { Loader2, Search, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function StatusLookupPage() {
  const [requestId, setRequestId] = useState('');
  const [searchId, setSearchId] = useState<string | null>(null);
  const { data: request, isLoading, error } = useServiceRequestLookup(searchId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestId.trim()) {
      setSearchId(requestId.trim());
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Track Your Order</h1>
        <p className="text-muted-foreground">
          Enter your request ID to view the current status and history.
        </p>
      </div>

      <BrandCard className="mb-8">
        <form onSubmit={handleSearch} className="p-6">
          <FormField
            label="Request ID"
            helperText="Enter the ID you received when submitting your request"
          >
            <div className="flex gap-3">
              <Input
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
                placeholder="e.g., 1"
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !requestId.trim()}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </FormField>
        </form>
      </BrandCard>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Request not found. Please check your ID and try again.
          </AlertDescription>
        </Alert>
      )}

      {request && (
        <div className="space-y-6">
          <BrandCard>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Request #{request.id.toString()}</h2>
                  <p className="text-muted-foreground">{request.customerName}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{request.contactInfo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">
                    {new Date(Number(request.submittedTime) / 1000000).toLocaleDateString()}
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

              {request.totalPriceEstimate && request.totalPriceEstimate !== '$0' && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Estimated Total</p>
                  <p className="text-2xl font-bold text-primary">{request.totalPriceEstimate}</p>
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

          {request.publicNotes.length > 0 && (
            <BrandCard>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Updates</h3>
                <div className="space-y-4">
                  {request.publicNotes.map((note, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4 py-2">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium text-sm">{note.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(Number(note.timestamp) / 1000000).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">{note.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </BrandCard>
          )}
        </div>
      )}
    </div>
  );
}
