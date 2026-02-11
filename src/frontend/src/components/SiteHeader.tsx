import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import LoginButton from './auth/LoginButton';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/useQueries';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { APP_NAME } from '@/lib/branding';

export default function SiteHeader() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePricingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    // Navigate to home if not already there
    if (window.location.pathname !== '/') {
      window.location.href = '/#pricing';
    } else {
      // Scroll to pricing section
      const pricingElement = document.getElementById('pricing');
      if (pricingElement) {
        const headerOffset = 80;
        const elementPosition = pricingElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/assets/generated/kslab-logo.dim_512x512.png" 
              alt="K's Lab Logo" 
              className="h-10 w-10"
            />
            <span className="font-bold text-lg hidden sm:inline">{APP_NAME}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <a
              href="/#pricing"
              onClick={handlePricingClick}
              className="text-sm font-medium transition-colors hover:text-primary cursor-pointer"
            >
              Pricing
            </a>
            <Link
              to="/service-request"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              New Request
            </Link>
            <Link
              to="/status"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Track Order
            </Link>
            {identity && isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <LoginButton />
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t border-border/40">
            <Link
              to="/"
              className="block px-4 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-accent/50 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <a
              href="/#pricing"
              onClick={handlePricingClick}
              className="block px-4 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-accent/50 rounded cursor-pointer"
            >
              Pricing
            </a>
            <Link
              to="/service-request"
              className="block px-4 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-accent/50 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              New Request
            </Link>
            <Link
              to="/status"
              className="block px-4 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-accent/50 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Track Order
            </Link>
            {identity && isAdmin && (
              <Link
                to="/admin"
                className="block px-4 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-accent/50 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
