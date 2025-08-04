import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";
export const Footer = () => {
  const { t } = useLanguage();

  return (
    <>
             {/* QR Code Section Above Footer */}
       <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 mt-16">
                   <div className="w-full px-4">
           <div className="text-center mb-8">
             <h2 className="text-2xl font-bold text-foreground mb-2">Payment QR Codes</h2>
             <p className="text-muted-foreground">Scan any QR code to make payment</p>
           </div>
           <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
             {/* Vimali QR Code */}
             <div className="text-center">
               <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                 <div className="w-40 h-40 md:w-48 md:h-48 mx-auto bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                   <img 
                     src="/vimali.jpg" 
                     alt="Vimali QR Code" 
                     className="w-36 h-36 md:w-44 md:h-44 object-contain rounded-xl"
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
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="w-40 h-40 md:w-48 md:h-48 mx-auto bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                                                                                   <img 
                        src="/2aqrcode.jpg"
                        alt="QR Code" 
                        className="w-36 h-36 md:w-44 md:h-44 object-contain rounded-xl"
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

      <footer className="bg-card border-t border-border">
             <div className="w-[98%] max-w-7xl mx-auto px-4 py-8">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-primary bg-clip-text ">
              KMPyrotech
            </h3>
            <p className="text-muted-foreground text-sm">
              Premium quality fireworks and crackers for all your celebrations. 
              Making every festival memorable since 1995.
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
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                {t('home')}
              </Link>
              <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                {t('categories')}
              </Link>
              <Link to="/cart" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                {t('cart')}
              </Link>
              <Link to="/track" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                {t('trackOrder')}
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                {t('privacyPolicy')}
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                {t('termsConditions')}
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Return Policy
              </a>
             <Link to="/adminlogin"> <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Safety Guidelines
              </a> </Link>
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