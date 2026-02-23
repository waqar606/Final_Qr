import { useLocation, useNavigate } from 'react-router-dom';
import { Check, ArrowRight, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
const features = [
  'Create unlimited dynamic QR codes',
  'Access a variety of QR types',
  'Unlimited modifications of QR codes',
  'Unlimited scans',
  'Multiple QR code download formats',
  'Access to advanced analytics',
  'Premium customer support',
  'Cancel at anytime',
];
const countries = [
  'Pakistan', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'India', 'Germany', 'France', 'UAE', 'Saudi Arabia',
];
export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const plan = location.state?.plan;
  const [form, setForm] = useState({
    fullName: '',
    country: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
  });
  const [loading, setLoading] = useState(false);
  if (!plan) {
    navigate('/billing');
    return null;
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.country || !form.address1 || !form.city || !form.postalCode) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: 'Payment processing', description: 'Redirecting to payment gateway...' });
    }, 1500);
  };
  return (
    <div className="flex-1 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Billing Info */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-bold mb-6">Billing Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-xs text-muted-foreground">Full name</Label>
              <Input id="fullName" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Your full name" />
            </div>
            <div>
              <Label htmlFor="country" className="text-xs text-muted-foreground">Country or region</Label>
              <Select value={form.country} onValueChange={v => setForm(f => ({ ...f, country: v }))}>
                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="address1" className="text-xs text-muted-foreground">Address line 1</Label>
              <Input id="address1" value={form.address1} onChange={e => setForm(f => ({ ...f, address1: e.target.value }))} placeholder="Street address" />
            </div>
            <div>
              <Label htmlFor="address2" className="text-xs text-muted-foreground">Address line 2</Label>
              <Input id="address2" value={form.address2} onChange={e => setForm(f => ({ ...f, address2: e.target.value }))} placeholder="Apt., suite, unit number, etc. (optional)" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-xs text-muted-foreground">City</Label>
                <Input id="city" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="City" />
              </div>
              <div>
                <Label htmlFor="postalCode" className="text-xs text-muted-foreground">Postal code</Label>
                <Input id="postalCode" value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} placeholder="Postal code" />
              </div>
            </div>
            <Button type="submit" className="w-full mt-4" size="lg" disabled={loading}>
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>Continue to payment <ArrowRight className="w-4 h-4 ml-1" /></>
              )}
            </Button>
          </form>
        </div>
        {/* Summary */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-6">Summary</h2>
          <div className="border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <span className="font-semibold">{plan.name} Plan</span>
              </div>
              <div className="text-right">
                <div className="font-bold">{plan.priceDetail}</div>
                <div className="text-xs text-muted-foreground">({plan.price})</div>
              </div>
            </div>
            <div className="border-t pt-3 flex items-center justify-between">
              <span className="font-bold">Total</span>
              <div className="text-right">
                <div className="font-bold">{plan.priceDetail}</div>
                <div className="text-xs text-primary">({plan.price})</div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold mb-3">{plan.name} Plan</h3>
            <ul className="space-y-2">
              {features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            The selected plan provides access to Online QR Generator and renews every {plan.name === 'Monthly' ? '1 month' : plan.name === 'Annually' ? '1 year' : '3 months'} at {plan.priceDetail} until canceled. Cancel anytime directly from your account.
          </p>
          <div className="mt-6">
            <p className="text-sm font-semibold text-primary mb-3">Accepted payment methods</p>
            <div className="grid grid-cols-2 gap-2">
              {['VISA', 'AMEX', 'G Pay', 'Mastercard'].map(m => (
                <div key={m} className="border rounded-lg p-3 flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}