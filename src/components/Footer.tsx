import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, X } from "lucide-react";
import { useState } from "react";

interface FooterProps {
  showQRCodes?: boolean;
}

export const Footer = ({ showQRCodes = false }: FooterProps) => {
  const { t } = useLanguage();
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  const handleImageClick = (src: string, alt: string) => {
    console.log('QR code clicked:', src, alt);
    setPreviewImage({ src, alt });
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  return (
    <>
      {/* QR Code Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 max-w-sm w-full">
            {/* Close Button */}
            <button
              onClick={closePreview}
              className="absolute top-2 right-2 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            
            {/* QR Code Image */}
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3 mb-3">
                <img 
                  src={previewImage.src}
                  alt={previewImage.alt}
                  className="w-full h-auto max-w-xs mx-auto object-contain"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-48 bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center text-gray-500 text-sm">QR Code Not Found</div>';
                    }
                  }}
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Scan this QR code with your payment app
              </p>
              <button
                onClick={closePreview}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Section Above Footer - Only show when showQRCodes is true */}
      {showQRCodes && (
        <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 mt-16">
          <div className="w-full px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Payment QR Codes</h2>
              <p className="text-muted-foreground">Click on any QR code to view it larger for easy scanning</p>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
              {/* Vimali QR Code */}
              <div className="text-center">
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 dark:border-gray-600">
                  <div className="w-40 h-40 md:w-48 md:h-48 mx-auto bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                    <img 
                      src="/qrcode1.jpg" 
                      alt="Vimali QR Code" 
                      className="w-36 h-36 md:w-44 md:h-44 object-contain rounded-xl"
                      onClick={() => handleImageClick("/qrcode1.jpg", "Vimali QR Code")}
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="w-36 h-36 md:w-44 md:h-44 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-500 text-sm">Vimali QR</div>';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 dark:border-gray-600">
                  <div className="w-40 h-40 md:w-48 md:h-48 mx-auto bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                    <img 
                      src="/qrcode2.jpg"
                      alt="QR Code" 
                      className="w-36 h-36 md:w-44 md:h-44 object-contain rounded-xl"
                      onClick={() => handleImageClick("/qrcode2.jpg", "QR Code")}
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="w-36 h-36 md:w-44 md:h-44 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-500 text-sm">QR Code</div>';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="bg-card border-t border-border">
        <div className="w-[98%] max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold bg-gradient-primary bg-clip-text ">
                KMPyrotech
              </h3>
              <p className="text-muted-foreground text-sm">
                Premium quality fireworks and crackers for all your celebrations. 
                Making every festival memorable since 2025.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-primary hover:text-secondary cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 text-primary hover:text-secondary cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 text-primary hover:text-secondary cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Quick Links</h4>
              <nav className="grid grid-cols-2 gap-x-16 gap-y-2">
                {/* Column 1 - Main Navigation */}
                <div className="space-y-2">
                  <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm block">
                    {t('home')}
                  </Link>
                  <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors text-sm block">
                    {t('categories')}
                  </Link>
                  <Link to="/cart" className="text-muted-foreground hover:text-primary transition-colors text-sm block">
                    {t('cart')}
                  </Link>
                  <Link to="/track" className="text-muted-foreground hover:text-primary transition-colors text-sm block">
                    {t('trackOrder')}
                  </Link>
                </div>
                
                {/* Column 2 - Important Links */}
                <div className="space-y-2">
                  <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm block">
                    {t('aboutUs')}
                  </Link>
                  <Link to="/payment-upload" className="text-muted-foreground hover:text-primary transition-colors text-sm block">
                    Payment Upload
                  </Link>
                  <Link to="/safety" className="text-muted-foreground hover:text-primary transition-colors text-sm block">
                    Safety Guidelines
                  </Link>
                </div>
              </nav>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">{t('contactUs')}</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground text-sm">+91 9940891416</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground text-sm">kmpyrotech2025@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <a 
                    href="https://goo.gl/maps/ajVcCJ9UYT9WJWH2A?g_st=aw" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Sivakasi, Tamil Nadu
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 KMPyrotech. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm mt-2 md:mt-0">
              Made for celebrations
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};