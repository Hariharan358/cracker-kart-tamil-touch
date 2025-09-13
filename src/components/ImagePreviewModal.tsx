import { X, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  productName: string;
}

export const ImagePreviewModal = ({ isOpen, onClose, imageUrl, productName }: ImagePreviewModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
        {/* Back Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          className="absolute top-4 left-4 z-10 bg-white/90 hover:bg-white shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        {/* Close Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white shadow-lg"
        >
          <X className="h-4 w-4" />
        </Button>
        
        {/* Image Container */}
        <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl">
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-auto max-h-[80vh] object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=600&fit=crop";
            }}
          />
          
          {/* Product Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-white font-semibold text-lg">{productName}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
