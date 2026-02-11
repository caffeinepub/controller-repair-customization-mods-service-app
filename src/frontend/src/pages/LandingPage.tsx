import { Link, useNavigate } from '@tanstack/react-router';
import { Wrench, Palette, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandCard from '@/components/BrandCard';
import PricingSection from '@/components/PricingSection';
import { useEffect } from 'react';
import { APP_NAME } from '@/lib/branding';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle hash navigation on initial load
    if (window.location.hash === '#pricing') {
      const pricingElement = document.getElementById('pricing');
      if (pricingElement) {
        // Delay to ensure layout is complete
        setTimeout(() => {
          const headerOffset = 80; // Account for sticky header
          const elementPosition = pricingElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <img 
                  src="/assets/generated/kslab-logo.dim_512x512.png" 
                  alt="K's Lab Logo" 
                  className="h-20 w-20 md:h-24 md:w-24"
                />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block text-primary">{APP_NAME}</span>
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl max-w-xl">
                Professional repairs, custom paint jobs, and performance mods for your gaming controllers. 
                Transform your gear into something extraordinary.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/service-request">
                    Start Your Build <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link to="/status">
                    Track Order
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/assets/generated/controller-hero.dim_1600x600.png" 
                alt="Controller Workbench" 
                className="w-full rounded-2xl shadow-2xl border border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From simple fixes to complete custom builds, we've got you covered.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
            <BrandCard className="group hover:border-primary/50 transition-all duration-300">
              <div className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Repairs</h3>
                <p className="text-muted-foreground">
                  Drift issues, broken buttons, connectivity problems—we fix it all. 
                  Fast turnaround with quality parts.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Analog stick drift repair</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Button replacement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Shell & housing fixes</span>
                  </li>
                </ul>
              </div>
            </BrandCard>

            <BrandCard className="group hover:border-primary/50 transition-all duration-300">
              <div className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Customization</h3>
                <p className="text-muted-foreground">
                  Make your controller uniquely yours with custom colors, finishes, 
                  and design elements.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Custom paint & hydro dip</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>LED lighting mods</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Custom button sets</span>
                  </li>
                </ul>
              </div>
            </BrandCard>

            <BrandCard className="group hover:border-primary/50 transition-all duration-300">
              <div className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Performance Mods</h3>
                <p className="text-muted-foreground">
                  Upgrade your controller with pro-level modifications for competitive advantage.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Hair trigger stops</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Back button installation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Precision thumbsticks</span>
                  </li>
                </ul>
              </div>
            </BrandCard>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent process from start to finish.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                1
              </div>
              <h3 className="text-xl font-bold">Submit Request</h3>
              <p className="text-muted-foreground">
                Fill out our service form with details about your controller and desired work.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                2
              </div>
              <h3 className="text-xl font-bold">We Work Our Magic</h3>
              <p className="text-muted-foreground">
                Our technicians repair, customize, or mod your controller with precision and care.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                3
              </div>
              <h3 className="text-xl font-bold">Delivered to You</h3>
              <p className="text-muted-foreground">
                Track your order status and receive your upgraded controller ready to dominate.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/service-request">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
