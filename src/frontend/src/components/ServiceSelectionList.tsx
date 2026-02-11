import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SERVICE_CATALOG, formatPrice } from '@/lib/servicesCatalog';

interface ServiceSelectionListProps {
  selectedServices: string[];
  onSelectionChange: (services: string[]) => void;
}

export default function ServiceSelectionList({ selectedServices, onSelectionChange }: ServiceSelectionListProps) {
  const handleToggle = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      onSelectionChange(selectedServices.filter(s => s !== serviceName));
    } else {
      onSelectionChange([...selectedServices, serviceName]);
    }
  };

  const repairServices = SERVICE_CATALOG.filter(s => s.category === 'repairs');
  const customizationServices = SERVICE_CATALOG.filter(s => s.category === 'customization');
  const performanceServices = SERVICE_CATALOG.filter(s => s.category === 'performance');

  const renderServiceGroup = (title: string, services: typeof SERVICE_CATALOG) => (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{title}</h4>
      <div className="space-y-2">
        {services.map((service) => (
          <div key={service.name} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <Checkbox
              id={service.name}
              checked={selectedServices.includes(service.name)}
              onCheckedChange={() => handleToggle(service.name)}
              className="mt-0.5"
            />
            <div className="flex-1 flex items-start justify-between gap-2">
              <Label
                htmlFor={service.name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {service.name}
              </Label>
              <span className={`text-sm font-semibold whitespace-nowrap ${service.price === null ? 'text-muted-foreground italic' : 'text-primary'}`}>
                {formatPrice(service.price)}
                {service.price === null && <span className="text-xs ml-1">(Quoted after inspection)</span>}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderServiceGroup('Repairs', repairServices)}
      {renderServiceGroup('Customization', customizationServices)}
      {renderServiceGroup('Performance Mods', performanceServices)}
    </div>
  );
}
