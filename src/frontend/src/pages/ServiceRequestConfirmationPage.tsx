import { Link, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import BrandCard from '@/components/BrandCard';
import { CheckCircle2, ArrowRight, Search } from 'lucide-react';

export default function ServiceRequestConfirmationPage() {
  const { requestId } = useParams({ from: '/confirmation/$requestId' });

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <BrandCard className="text-center">
        <div className="p-8 space-y-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Request Submitted!</h1>
            <p className="text-muted-foreground">
              Your service request has been received and is being reviewed.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Your Request ID</p>
            <p className="text-3xl font-bold font-mono tracking-wider text-primary">
              #{requestId}
            </p>
            <p className="text-sm text-muted-foreground">
              Save this ID to track your order status
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              We'll review your request and reach out via your preferred contact method with 
              an estimate and next steps. You can track your order status anytime using your request ID.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="flex-1">
                <Link to="/status">
                  <Search className="mr-2 h-4 w-4" />
                  Track Order Status
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link to="/">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </BrandCard>
    </div>
  );
}
