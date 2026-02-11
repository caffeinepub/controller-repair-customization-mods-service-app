import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BrandCard from '@/components/BrandCard';
import FormField from '@/components/FormField';
import ServiceSelectionList from '@/components/ServiceSelectionList';
import { useCreateServiceRequest } from '@/hooks/useQueries';
import { useClientSideReferenceImages } from '@/hooks/useClientSideReferenceImages';
import { calculateTotal } from '@/lib/servicesCatalog';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ServiceRequestPage() {
  const navigate = useNavigate();
  const createRequest = useCreateServiceRequest();
  const { images, addImage, removeImage, clearImages } = useClientSideReferenceImages();

  const [formData, setFormData] = useState({
    customerName: '',
    contactMethod: '',
    contactInfo: '',
    platform: '',
    description: '',
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculatedTotal = calculateTotal(selectedServices);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          addImage(file);
        }
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }
    if (!formData.contactMethod) {
      newErrors.contactMethod = 'Contact method is required';
    }
    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Contact information is required';
    }
    if (!formData.platform) {
      newErrors.platform = 'Controller platform is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Service description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const contactInfoFormatted = `${formData.contactMethod}: ${formData.contactInfo}`;
      
      // Build description with selected services
      let descriptionFormatted = `Platform: ${formData.platform}\n\n`;
      
      if (selectedServices.length > 0) {
        descriptionFormatted += `Selected Services:\n${selectedServices.map(s => `- ${s}`).join('\n')}\n\n`;
      }
      
      descriptionFormatted += formData.description;

      const totalPriceEstimate = calculatedTotal > 0 ? `$${calculatedTotal}` : '$0';

      const requestId = await createRequest.mutateAsync({
        customerName: formData.customerName,
        contactInfo: contactInfoFormatted,
        servicesRequested: selectedServices,
        totalPriceEstimate,
        description: descriptionFormatted,
      });

      clearImages();
      toast.success('Service request submitted successfully!');
      navigate({ to: '/confirmation/$requestId', params: { requestId: requestId.toString() } });
    } catch (error) {
      console.error('Failed to submit request:', error);
      toast.error('Failed to submit request. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Service Request</h1>
        <p className="text-muted-foreground">
          Tell us about your controller and what you'd like us to do.
        </p>
      </div>

      <BrandCard>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormField
            label="Your Name"
            required
            error={errors.customerName}
            helperText="How should we address you?"
          >
            <Input
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              placeholder="John Doe"
            />
          </FormField>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              label="Preferred Contact Method"
              required
              error={errors.contactMethod}
            >
              <Select
                value={formData.contactMethod}
                onValueChange={(value) => handleInputChange('contactMethod', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              label="Contact Information"
              required
              error={errors.contactInfo}
            >
              <Input
                value={formData.contactInfo}
                onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                placeholder="your@email.com or phone"
              />
            </FormField>
          </div>

          <FormField
            label="Controller Platform"
            required
            error={errors.platform}
            helperText="What type of controller do you have?"
          >
            <Select
              value={formData.platform}
              onValueChange={(value) => handleInputChange('platform', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Xbox Series X/S">Xbox Series X/S</SelectItem>
                <SelectItem value="Xbox One">Xbox One</SelectItem>
                <SelectItem value="PlayStation 5">PlayStation 5</SelectItem>
                <SelectItem value="PlayStation 4">PlayStation 4</SelectItem>
                <SelectItem value="Nintendo Switch Pro">Nintendo Switch Pro</SelectItem>
                <SelectItem value="Nintendo Switch Joy-Con">Nintendo Switch Joy-Con</SelectItem>
                <SelectItem value="PC/Generic">PC/Generic</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <div className="border-t border-border pt-6">
            <FormField
              label="Select Services"
              helperText="Choose the services you need (optional - you can also describe them below)"
            >
              <div className="bg-muted/30 p-4 rounded-lg">
                <ServiceSelectionList
                  selectedServices={selectedServices}
                  onSelectionChange={setSelectedServices}
                />
                
                {selectedServices.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Estimated Total:</span>
                      <span className="text-2xl font-bold text-primary">
                        ${calculatedTotal}
                      </span>
                    </div>
                    {selectedServices.some(s => s === 'Controller cleaning') && (
                      <p className="text-xs text-muted-foreground mt-2">
                        * Final price may vary based on selected services requiring quotes
                      </p>
                    )}
                  </div>
                )}
              </div>
            </FormField>
          </div>

          <FormField
            label="Additional Details"
            required
            error={errors.description}
            helperText="Describe any specific issues, preferences, or additional requests"
          >
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Example: Left analog stick has severe drift. For custom paint, I'd like a matte orange finish. Please let me know if you need any additional information."
              rows={6}
            />
          </FormField>

          <FormField
            label="Reference Images (Optional)"
            helperText="Upload images of your controller or design inspiration (stored locally, not sent to server)"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Images
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {images.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {images.length} image{images.length !== 1 ? 's' : ''} selected
                  </span>
                )}
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.preview}
                        alt="Reference"
                        className="w-full h-32 object-cover rounded-lg border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormField>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={createRequest.isPending}
              className="flex-1"
            >
              {createRequest.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </div>
        </form>
      </BrandCard>
    </div>
  );
}
