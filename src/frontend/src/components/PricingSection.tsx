import { DollarSign } from 'lucide-react';
import BrandCard from './BrandCard';
import { getServicesByCategory, formatPrice } from '@/lib/servicesCatalog';

export default function PricingSection() {
  const repairServices = getServicesByCategory('repairs').filter(s => s.name !== 'Controller cleaning');
  const customizationServices = getServicesByCategory('customization');
  const performanceServices = getServicesByCategory('performance');

  return (
    <section id="pricing" className="py-16 md:py-24 bg-background scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparent pricing for all our services. Final quotes provided after evaluation.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {/* Repairs */}
          <BrandCard className="group hover:border-primary/50 transition-all duration-300">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Repairs</h3>
              </div>
              
              <div className="space-y-3">
                {repairServices.map((service, index) => (
                  <div 
                    key={service.name}
                    className={`flex justify-between items-start ${index < repairServices.length - 1 ? 'border-b border-border/50 pb-2' : ''}`}
                  >
                    <span className="text-sm font-medium">{service.name}</span>
                    <span className="text-sm font-bold text-primary">{formatPrice(service.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </BrandCard>

          {/* Customization */}
          <BrandCard className="group hover:border-primary/50 transition-all duration-300">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Customization</h3>
              </div>
              
              <div className="space-y-3">
                {customizationServices.map((service, index) => (
                  <div 
                    key={service.name}
                    className={`flex justify-between items-start ${index < customizationServices.length - 1 ? 'border-b border-border/50 pb-2' : ''}`}
                  >
                    <span className="text-sm font-medium">{service.name}</span>
                    <span className="text-sm font-bold text-primary">{formatPrice(service.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </BrandCard>

          {/* Performance Mods */}
          <BrandCard className="group hover:border-primary/50 transition-all duration-300">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Performance Mods</h3>
              </div>
              
              <div className="space-y-3">
                {performanceServices.map((service, index) => (
                  <div 
                    key={service.name}
                    className={`flex justify-between items-start ${index < performanceServices.length - 1 ? 'border-b border-border/50 pb-2' : ''}`}
                  >
                    <span className="text-sm font-medium">{service.name}</span>
                    <span className="text-sm font-bold text-primary">{formatPrice(service.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </BrandCard>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Prices are estimates and may vary based on controller model and condition. 
            Final quotes will be provided after evaluation of your specific request.
          </p>
        </div>
      </div>
    </section>
  );
}
