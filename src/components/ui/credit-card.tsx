import { Sparkles } from "lucide-react";

interface CreditCardProps {
  orderId: string;
  customerName: string;
  className?: string;
}

export const CreditCard = ({ orderId, customerName, className = "" }: CreditCardProps) => {
  // Format order ID to look like a credit card number (4 groups of 4 digits)
  const formatCardNumber = (id: string) => {
    // Remove any non-digit characters and pad to 16 digits
    const cleanId = id.replace(/\D/g, '').padEnd(16, '0').slice(0, 16);
    return cleanId.match(/.{1,4}/g)?.join(' ') || '0000 0000 0000 0000';
  };

  return (
    <div className={`relative w-full max-w-sm mx-auto ${className}`}>
      {/* Credit Card */}
      <div className="relative bg-gradient-to-br from-primary via-accent to-secondary rounded-xl p-6 text-white shadow-2xl transform transition-all duration-300 hover:scale-105">
        {/* Sparkle effects */}
        <div className="absolute top-2 right-2 opacity-60">
          <Sparkles className="h-4 w-4 animate-sparkle" />
        </div>
        <div className="absolute bottom-2 left-2 opacity-40">
          <Sparkles className="h-3 w-3 animate-sparkle" style={{ animationDelay: '0.5s' }} />
        </div>
        
        {/* Card Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium opacity-90">KM PYROTECH</span>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-75">VALID THRU</div>
            <div className="text-sm font-semibold">12/25</div>
          </div>
        </div>

        {/* Card Number */}
        <div className="mb-6">
          <div className="text-xs opacity-75 mb-1">CARD NUMBER</div>
          <div className="text-xl font-mono font-bold tracking-wider">
            {formatCardNumber(orderId)}
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs opacity-75 mb-1">CARD HOLDER</div>
            <div className="text-sm font-semibold uppercase">
              {customerName || 'CUSTOMER NAME'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-75 mb-1">CVV</div>
            <div className="text-sm font-mono">123</div>
          </div>
        </div>

        {/* Chip */}
        <div className="absolute top-1/2 left-6 transform -translate-y-1/2">
          <div className="w-8 h-6 bg-yellow-400/80 rounded-sm"></div>
        </div>
      </div>

      {/* Card Label */}
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground font-medium">
          KM PYROTECH Payment Card
        </p>
        <p className="text-xs text-muted-foreground">
          Order ID: {orderId}
        </p>
      </div>
    </div>
  );
}; 