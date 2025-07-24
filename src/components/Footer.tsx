import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
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
                <span className="text-muted-foreground text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">kmpyrotech@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">Sivakasi, Tamil Nadu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 KMPyrotech. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm mt-2 md:mt-0">
            Made with ❤️ for celebrations
          </p>
        </div>
      </div>
    </footer>
  );
};