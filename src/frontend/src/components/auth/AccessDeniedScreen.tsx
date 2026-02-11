import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import BrandCard from '@/components/BrandCard';
import { ShieldAlert, Home, LogIn } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export default function AccessDeniedScreen() {
  const { identity, login } = useInternetIdentity();

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <BrandCard>
        <div className="p-12 text-center space-y-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
            <p className="text-muted-foreground">
              {identity
                ? 'You do not have permission to access this area.'
                : 'Please log in to access the admin area.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!identity ? (
              <Button onClick={login} size="lg">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            ) : null}
            <Button asChild variant="outline" size="lg">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </BrandCard>
    </div>
  );
}
