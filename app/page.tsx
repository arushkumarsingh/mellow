"use client"

import React, { useState } from 'react';
import { ShoppingCart, Bell, User, X, Tag, Minus, Plus, LogOut, Settings, Package, Heart, CreditCard } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header - Account & Notifications */}
      <div className="border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-10 md:h-12 items-center justify-between">
            <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-foreground/80">
              <Tag className="h-3 w-3 md:h-4 md:w-4 text-secondary" />
              <span className="font-medium truncate">Free shipping ₹800+!</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9">
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]">
                      {notifications.filter((n) => n.unread).length}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((notif) => (
                    <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 py-3">
                      <div className="flex items-center gap-2 w-full">
                        {notif.unread && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                        <span className="text-sm flex-1">{notif.text}</span>
                      </div>
                      <span className="text-xs text-muted-foreground pl-4">{notif.time}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Account */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <div className="px-2 py-3 border-b border-border">
                    <p className="text-sm font-semibold">John Doe</p>
                    <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                  </div>
                  <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wide">Account</DropdownMenuLabel>
                  <DropdownMenuItem className="gap-2 py-2.5">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 py-2.5">
                    <Package className="h-4 w-4" />
                    <span>Orders</span>
                    <Badge className="ml-auto" variant="secondary">3</Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 py-2.5">
                    <Heart className="h-4 w-4" />
                    <span>Wishlist</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 py-2.5">
                    <CreditCard className="h-4 w-4" />
                    <span>Payment Methods</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wide">Preferences</DropdownMenuLabel>
                  <DropdownMenuItem className="gap-2 py-2.5">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 py-2.5 text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

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
                <SheetContent className="w-full sm:max-w-lg flex flex-col">
                  <SheetHeader className="flex-shrink-0">
                    <SheetTitle className="text-lg md:text-xl">Shopping Cart</SheetTitle>
                    <SheetDescription className="text-sm">
                      {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in your cart
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col flex-1 min-h-0">
                    <div className="flex-1 overflow-auto mt-6 md:mt-8 space-y-3 md:space-y-4">
                      {cart.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8 text-sm md:text-base">Your cart is empty</p>
                      ) : (
                        cart.map((item) => (
                          <div key={item.id} className="flex gap-2.5 md:gap-4 border-b border-border pb-3 md:pb-4">
                            <div className="h-20 w-20 md:h-24 md:w-24 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm md:text-base truncate">{item.name}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5 md:mt-1">{item.color}</p>
                              <div className="flex items-center gap-1.5 md:gap-2 mt-1.5 md:mt-2">
                                <span className="text-base md:text-lg font-bold">₹{item.price}</span>
                                <span className="text-xs md:text-sm text-muted-foreground line-through">
                                  ₹{item.originalPrice}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 md:gap-2 mt-1.5 md:mt-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 md:h-7 md:w-7"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                </Button>
                                <span className="text-xs md:text-sm w-6 md:w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 md:h-7 md:w-7"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                </Button>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 md:h-8 md:w-8 flex-shrink-0"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                    {cart.length > 0 && (
                      <div className="border-t border-border pt-3 md:pt-4 space-y-3 md:space-y-4 mt-auto flex-shrink-0">
                        <div className="space-y-1.5 md:space-y-2">
                          <div className="flex justify-between text-xs md:text-sm">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span className="font-medium">₹{cartTotal}</span>
                          </div>
                          <div className="flex justify-between text-xs md:text-sm">
                            <span className="text-muted-foreground">You saved:</span>
                            <span className="font-medium text-green-600">
                             ₹{totalSavings}
                            </span>
                          </div>
                          <Separator />
                          <div className="flex justify-between text-base md:text-lg font-bold">
                            <span>Total:</span>
                            <span>₹{cartTotal}</span>
                          </div>
                        </div>
                        <Button className="w-full h-10 md:h-11 text-sm md:text-base">
                          Proceed to Checkout
                        </Button>
                      </div>
                    )}
                  </div>
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
              <div className="relative aspect-square overflow-hidden bg-muted/50">
                <Carousel
                  images={tshirt.images}
                  className="h-full w-full"
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
