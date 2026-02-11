// Shared service catalog with exact pricing
export interface ServiceItem {
  name: string;
  price: number | null; // null means price TBD
  category: 'repairs' | 'customization' | 'performance';
}

export const SERVICE_CATALOG: ServiceItem[] = [
  // Repairs
  { name: 'Analog stick drift repair', price: 5, category: 'repairs' },
  { name: 'Button replacement', price: 5, category: 'repairs' },
  { name: 'Shell and housing', price: 10, category: 'repairs' },
  { name: 'Connectivity issues', price: 10, category: 'repairs' },
  { name: 'Trigger repair', price: 15, category: 'repairs' },
  
  // Customization
  { name: 'Custom paint', price: 15, category: 'customization' },
  { name: 'LED lighting mods', price: 20, category: 'customization' },
  { name: 'Custom button set', price: 15, category: 'customization' },
  { name: 'Full custom build', price: 55, category: 'customization' },
  
  // Performance Mods
  { name: 'Performance hair triggers', price: 15, category: 'performance' },
  { name: 'Back button', price: 20, category: 'performance' },
  { name: 'Precision thumbsticks', price: 20, category: 'performance' },
  { name: 'Full performance', price: 65, category: 'performance' },
  
  // Additional services
  { name: 'Controller cleaning', price: null, category: 'repairs' },
];

export function getServicesByCategory(category: 'repairs' | 'customization' | 'performance'): ServiceItem[] {
  return SERVICE_CATALOG.filter(service => service.category === category);
}

export function formatPrice(price: number | null): string {
  if (price === null) return 'Price TBD';
  return `$${price}`;
}

export function calculateTotal(selectedServices: string[]): number {
  return SERVICE_CATALOG
    .filter(service => selectedServices.includes(service.name) && service.price !== null)
    .reduce((sum, service) => sum + (service.price || 0), 0);
}
