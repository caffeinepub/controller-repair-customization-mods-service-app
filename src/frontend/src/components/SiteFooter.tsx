import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { APP_NAME } from '@/lib/branding';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'controller-service';

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-bold mb-3">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Controller Repairs</li>
              <li>Custom Paint Jobs</li>
              <li>Performance Mods</li>
              <li>LED Installations</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/service-request" className="text-muted-foreground hover:text-primary transition-colors">
                  Submit Request
                </Link>
              </li>
              <li>
                <Link to="/status" className="text-muted-foreground hover:text-primary transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>FAQ</li>
              <li>
                <a 
                  href="tel:+12428210504" 
                  className="hover:text-primary transition-colors"
                >
                  1-242-821-0504
                </a>
              </li>
              <li>Warranty Info</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Connect</h3>
            <p className="text-sm text-muted-foreground">
              Follow us for updates and showcase builds.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>© {currentYear} {APP_NAME}. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Built with <Heart className="h-4 w-4 text-primary fill-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
