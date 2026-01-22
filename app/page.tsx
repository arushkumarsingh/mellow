"use client"

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Bell, User, X, Tag, Minus, Plus, LogOut, Settings, Package, Heart, CreditCard } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Carousel } from '@/components/ui/carousel';

interface TShirt {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
  color: string;
}

interface CartItem extends TShirt {
  quantity: number;
}

export default function TShirtStore() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);

  const tshirts: TShirt[] = [
    {
      id: 1,
      name: 'Ghost Buster Tshirt',
      price: 699,
      originalPrice: 1399,
      discount: 50,
      images: ['/shirts/1.1.jpeg', '/shirts/1.2.jpeg'],
      color: 'White',
    },
    {
      id: 2,
      name: 'Music lover Tshirt',
      price: 699,
      originalPrice: 1399,
      discount: 50,
      images: ['/shirts/2.1.jpeg', '/shirts/2.2.jpeg'],
      color: 'Black',
    },
    {
      id: 3,
      name: 'T-Shirt for Animal Lover',
      price: 699,
      originalPrice: 1399,
      discount: 50,
      images: ['/shirts/3.1.jpeg', '/shirts/3.2.jpeg'],
      color: 'Navy',
    },
    {
      id: 4,
      name: 'Super Bike Tshirt',
      price: 699,
      originalPrice: 1399,
      discount: 50,
      images: ['/shirts/4.1.jpeg', '/shirts/4.2.jpeg'],
      color: 'Grey',
    },
    
  ];

  const notifications = [
    { id: 1, text: 'Your order has been shipped!', time: '2 hours ago', unread: true },
    { id: 2, text: 'New collection available now', time: '1 day ago', unread: true },
    { id: 3, text: 'Flash sale starts tomorrow', time: '2 days ago', unread: false },
  ];

  const addToCart = (tshirt: TShirt) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === tshirt.id);
      if (existing) {
        return prev.map((item) =>
          item.id === tshirt.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...tshirt, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalSavings = cart.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0
  );

  function CheckoutForm() {
    const [state, handleSubmit] = useForm("maqenong");
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
    
    useEffect(() => {
      if (state.succeeded) {
        setShowWhatsAppPopup(true);
      }
    }, [state.succeeded]);

    const validateField = (name: string, value: string): string => {
      switch (name) {
        case 'name':
          if (!value.trim()) return 'Name is required';
          if (value.trim().length < 2) return 'Name must be at least 2 characters';
          if (/[0-9]/.test(value)) return 'Name cannot contain numbers';
          return '';
        case 'mobile':
          if (!value.trim()) return 'Mobile number is required';
          const mobileRegex = /^[6-9]\d{9}$/;
          const cleanMobile = value.replace(/\D/g, '');
          if (cleanMobile.length !== 10) return 'Mobile number must be 10 digits';
          if (!mobileRegex.test(cleanMobile)) return 'Mobile number must start with 6-9';
          return '';
        case 'address':
          if (!value.trim()) return 'Address is required';
          if (value.trim().length < 10) return 'Address must be at least 10 characters';
          return '';
        case 'city':
          if (!value.trim()) return 'City is required';
          if (value.trim().length < 2) return 'City must be at least 2 characters';
          if (/[0-9]/.test(value)) return 'City cannot contain numbers';
          return '';
        case 'pincode':
          if (!value.trim()) return 'Pin code is required';
          const pincodeRegex = /^\d{6}$/;
          if (!pincodeRegex.test(value.trim())) return 'Pin code must be 6 digits';
          return '';
        case 'state':
          if (!value.trim()) return 'State is required';
          if (value.trim().length < 2) return 'State must be at least 2 characters';
          if (/[0-9]/.test(value)) return 'State cannot contain numbers';
          return '';
        case 'gender':
          if (!value) return 'Please select your gender';
          return '';
        default:
          return '';
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      let processedValue = value;
      
      // Format mobile number - only allow digits
      if (name === 'mobile' && e.target instanceof HTMLInputElement) {
        const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
        e.target.value = digitsOnly;
        processedValue = digitsOnly;
      }
      
      // Format pincode - only allow digits
      if (name === 'pincode' && e.target instanceof HTMLInputElement) {
        const digitsOnly = value.replace(/\D/g, '').slice(0, 6);
        e.target.value = digitsOnly;
        processedValue = digitsOnly;
      }
      
      const error = validateField(name, processedValue);
      setLocalErrors(prev => ({
        ...prev,
        [name]: error
      }));
    };

    const validateForm = (formData: FormData): boolean => {
      const errors: Record<string, string> = {};
      const fields = ['name', 'mobile', 'address', 'city', 'pincode', 'state', 'gender'];
      
      fields.forEach(field => {
        const value = formData.get(field) as string;
        const error = validateField(field, value);
        if (error) {
          errors[field] = error;
        }
      });

      setLocalErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      
      if (!validateForm(formData)) {
        return;
      }

      await handleSubmit(e);
    };

    if (state.succeeded) {
      return (
        <div className="p-6 text-center">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Prebook Successful!</h3>
            <p className="text-muted-foreground">Thank you for your prebook. Join our WhatsApp channel for updates!</p>
          </div>
          <Button onClick={() => { setShowCheckoutForm(false); setShowCheckout(false); setCart([]); }}>
            Continue Shopping
          </Button>
        </div>
      );
    }
    return (
      <form onSubmit={handleFormSubmit} className="space-y-5 pb-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
            Name <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            required
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              localErrors.name ? 'border-destructive' : 'border-border'
            }`}
            placeholder="Enter your full name"
          />
          {localErrors.name && (
            <p className="text-destructive text-sm mt-1.5">{localErrors.name}</p>
          )}
          <ValidationError 
            prefix="Name" 
            field="name"
            errors={state.errors}
            className="text-destructive text-sm mt-1.5 block"
          />
        </div>

        <div>
          <label htmlFor="mobile" className="block text-sm font-semibold text-foreground mb-2">
            Mobile Number <span className="text-destructive">*</span>
          </label>
          <input
            id="mobile"
            type="tel"
            name="mobile"
            required
            onChange={handleInputChange}
            maxLength={10}
            className={`w-full px-4 py-2.5 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              localErrors.mobile ? 'border-destructive' : 'border-border'
            }`}
            placeholder="Enter 10-digit mobile number"
          />
          {localErrors.mobile && (
            <p className="text-destructive text-sm mt-1.5">{localErrors.mobile}</p>
          )}
          <ValidationError 
            prefix="Mobile" 
            field="mobile"
            errors={state.errors}
            className="text-destructive text-sm mt-1.5 block"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-semibold text-foreground mb-2">
            Address <span className="text-destructive">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            required
            rows={4}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all ${
              localErrors.address ? 'border-destructive' : 'border-border'
            }`}
            placeholder="Enter your complete address"
          />
          {localErrors.address && (
            <p className="text-destructive text-sm mt-1.5">{localErrors.address}</p>
          )}
          <ValidationError 
            prefix="Address" 
            field="address"
            errors={state.errors}
            className="text-destructive text-sm mt-1.5 block"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-foreground mb-2">
              City <span className="text-destructive">*</span>
            </label>
            <input
              id="city"
              type="text"
              name="city"
              required
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                localErrors.city ? 'border-destructive' : 'border-border'
              }`}
              placeholder="Enter your city"
            />
            {localErrors.city && (
              <p className="text-destructive text-sm mt-1.5">{localErrors.city}</p>
            )}
            <ValidationError 
              prefix="City" 
              field="city"
              errors={state.errors}
              className="text-destructive text-sm mt-1.5 block"
            />
          </div>

          <div>
            <label htmlFor="pincode" className="block text-sm font-semibold text-foreground mb-2">
              Pin Code <span className="text-destructive">*</span>
            </label>
            <input
              id="pincode"
              type="text"
              name="pincode"
              required
              onChange={handleInputChange}
              maxLength={6}
              className={`w-full px-4 py-2.5 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                localErrors.pincode ? 'border-destructive' : 'border-border'
              }`}
              placeholder="Enter 6-digit pin code"
            />
            {localErrors.pincode && (
              <p className="text-destructive text-sm mt-1.5">{localErrors.pincode}</p>
            )}
            <ValidationError 
              prefix="Pin Code" 
              field="pincode"
              errors={state.errors}
              className="text-destructive text-sm mt-1.5 block"
            />
          </div>
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-semibold text-foreground mb-2">
            State <span className="text-destructive">*</span>
          </label>
          <input
            id="state"
            type="text"
            name="state"
            required
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              localErrors.state ? 'border-destructive' : 'border-border'
            }`}
            placeholder="Enter your state"
          />
          {localErrors.state && (
            <p className="text-destructive text-sm mt-1.5">{localErrors.state}</p>
          )}
          <ValidationError 
            prefix="State" 
            field="state"
            errors={state.errors}
            className="text-destructive text-sm mt-1.5 block"
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-semibold text-foreground mb-2">
            Gender <span className="text-destructive">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            required
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              localErrors.gender ? 'border-destructive' : 'border-border'
            }`}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {localErrors.gender && (
            <p className="text-destructive text-sm mt-1.5">{localErrors.gender}</p>
          )}
          <ValidationError 
            prefix="Gender" 
            field="gender"
            errors={state.errors}
            className="text-destructive text-sm mt-1.5 block"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-11"
            onClick={() => setShowCheckoutForm(false)}
          >
            Back
          </Button>
          <Button type="submit" disabled={state.submitting} className="flex-1 h-11 font-semibold">
            {state.submitting ? 'Submitting...' : 'Prebook Order'}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg shadow-primary/5">
        <div className="container mx-auto px-4">
          <div className="flex h-14 md:h-16 items-center justify-between">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">Mellow</h1>
            <div className="flex items-center gap-2 md:gap-4">

              <Sheet open={showCheckout} onOpenChange={setShowCheckout}>
                <SheetTrigger asChild>
                  <Button variant="default" size="sm" className="relative gap-1.5 md:gap-2 h-8 md:h-9 px-2.5 md:px-3">
                    <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span className="text-xs md:text-sm">Cart</span>
                    {cartItemCount > 0 && (
                      <Badge variant="secondary" className="ml-0.5 md:ml-1 h-4 px-1 text-[10px] md:text-xs">
                        {cartItemCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg flex flex-col p-0 h-full max-h-screen">
                  <SheetHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-border">
                    <SheetTitle className="text-lg md:text-xl">
                      {showCheckoutForm ? 'Checkout' : 'Shopping Cart'}
                    </SheetTitle>
                    <SheetDescription className="text-sm">
                      {showCheckoutForm 
                        ? 'Please fill in your details to complete your order'
                        : `${cartItemCount} ${cartItemCount === 1 ? 'item' : 'items'} in your cart`
                      }
                    </SheetDescription>
                  </SheetHeader>
                  
                  {!showCheckoutForm ? (
                    <>
                      {/* Cart Items Section - Scrollable */}
                      <div className="flex-1 overflow-y-auto px-6 py-4">
                        {cart.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
                            <p className="text-center text-muted-foreground text-sm md:text-base">Your cart is empty</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {cart.map((item) => (
                              <Card key={item.id} className="p-4">
                                <div className="flex gap-4">
                                  <div className="h-24 w-24 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                                    <img
                                      src={item.images[0]}
                                      alt={item.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm md:text-base mb-1">{item.name}</h4>
                                        <p className="text-xs text-muted-foreground">{item.color}</p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 flex-shrink-0"
                                        onClick={() => removeFromCart(item.id)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                      <span className="text-lg font-bold">₹{item.price}</span>
                                      <span className="text-sm text-muted-foreground line-through">
                                        ₹{item.originalPrice}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-xs text-muted-foreground">Quantity:</span>
                                      <div className="flex items-center gap-2 border border-border rounded-md">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                          <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                          <Plus className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Cart Summary - Fixed at Bottom */}
                      {cart.length > 0 && (
                        <div className="flex-shrink-0 border-t border-border bg-background px-6 py-4 space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Subtotal:</span>
                              <span className="font-medium">₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">You saved:</span>
                              <span className="font-medium text-green-600">₹{totalSavings}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                              <span>Total:</span>
                              <span>₹{cartTotal}</span>
                            </div>
                          </div>
                          <Button 
                            className="w-full h-11 text-base font-semibold"
                            onClick={() => setShowCheckoutForm(true)}
                          >
                            Proceed to Checkout
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Checkout Form Section - Scrollable */
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                      <div className="mb-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowCheckoutForm(false)}
                          className="-ml-2"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Back to Cart
                        </Button>
                      </div>
                      <div className="pb-4">
                        <CheckoutForm />
                      </div>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-secondary/10 to-background py-10 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 md:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Premium T-Shirts Collection
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80 mb-6 md:mb-8">
              Discover our curated selection of comfortable, stylish tees. Up to 40% off on selected items!
            </p>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
              <Badge variant="secondary" className="text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30">
                <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Save up to 40%
              </Badge>
              <Badge variant="outline" className="text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 border-secondary/50 text-secondary hover:bg-secondary/10">
                Free Returns
              </Badge>
              <Badge variant="outline" className="text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 border-primary/50 text-primary hover:bg-primary/10">
                Fast Shipping
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Popup */}
      {showWhatsAppPopup && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" 
          onClick={(e) => {
            // Only close if clicking directly on the overlay, not on children
            if (e.target === e.currentTarget) {
              setShowWhatsAppPopup(false);
            }
          }}
          onTouchStart={(e) => {
            // Mark that touch started on overlay
            if (e.target === e.currentTarget) {
              (e.currentTarget as HTMLElement).setAttribute('data-touch-start', 'true');
            }
          }}
          onTouchEnd={(e) => {
            // Only close if touch started and ended on overlay
            if (e.target === e.currentTarget && (e.currentTarget as HTMLElement).getAttribute('data-touch-start') === 'true') {
              e.preventDefault();
              setShowWhatsAppPopup(false);
              (e.currentTarget as HTMLElement).removeAttribute('data-touch-start');
            }
          }}
        >
          <div 
            className="bg-background border border-border rounded-lg shadow-2xl max-w-md w-full p-6 relative z-[101]"
            style={{ pointerEvents: 'auto' }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              e.stopPropagation();
              // Don't prevent default here to allow normal touch interactions
            }}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowWhatsAppPopup(false);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowWhatsAppPopup(false);
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10 touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Join Our WhatsApp Community!</h3>
                <p className="text-muted-foreground mb-6">
                  Stay updated with order status, new arrivals, and exclusive offers by joining our WhatsApp channel.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open('https://chat.whatsapp.com/Gs5NUa2iIh7FJ7zIRRH1ke', '_blank');
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open('https://chat.whatsapp.com/Gs5NUa2iIh7FJ7zIRRH1ke', '_blank');
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-semibold transition-colors touch-manipulation active:bg-green-800"
                  style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', cursor: 'pointer' }}
                >
                  Join WhatsApp Channel
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowWhatsAppPopup(false);
                    setShowCheckoutForm(false);
                    setShowCheckout(false);
                    setCart([]);
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowWhatsAppPopup(false);
                    setShowCheckoutForm(false);
                    setShowCheckout(false);
                    setCart([]);
                  }}
                  className="w-full border border-border bg-background hover:bg-accent text-foreground py-3 px-4 rounded-md font-semibold transition-colors touch-manipulation active:bg-accent/80"
                  style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', cursor: 'pointer' }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        <div className="mb-6 md:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5 md:mb-2">Featured T-Shirts</h3>
          <p className="text-sm md:text-base text-muted-foreground">
            {tshirts.length} products available
          </p>
        </div>

        {/* T-Shirts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {tshirts.map((tshirt) => (
            <Card key={tshirt.id} className="group overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 border border-border hover:border-primary/50 bg-card/50 backdrop-blur">
              <div className="relative aspect-square overflow-hidden bg-muted/50 w-full">
                <Carousel
                  images={tshirt.images}
                  className="h-full w-full max-w-full"
                  imageClassName="group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <Badge className="absolute top-2 left-2 md:top-3 md:left-3 text-xs md:text-sm bg-destructive hover:bg-destructive text-white shadow-lg z-10">
                  {tshirt.discount}% OFF
                </Badge>
              </div>
              <CardContent className="p-3.5 sm:p-4 md:p-5 bg-gradient-to-b from-card to-card/80">
                <h3 className="font-bold text-base md:text-lg text-foreground mb-1">{tshirt.name}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-2.5 md:mb-3">{tshirt.color}</p>
                <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
                  <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    ₹{tshirt.price}
                  </span>
                  <span className="text-sm md:text-base text-muted-foreground line-through">
                    ₹{tshirt.originalPrice}
                  </span>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30 h-9 md:h-10 text-xs md:text-sm"
                  onClick={() => addToCart(tshirt)}
                >
                  <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
