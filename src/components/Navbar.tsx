import { Link } from "react-router-dom";
import { ShoppingCart, Sparkles, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { LanguageToggle } from "./LanguageToggle";
import { NotificationPermission } from "./NotificationPermission";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

interface NavbarProps {
  cartCount: number;
}

export const Navbar = ({ cartCount }: NavbarProps) => {
  const { t } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(resolvedTheme === "dark");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
    setIsDark(!isDark);
  };

  // Handle scroll effect for dynamic island behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Dynamic Island Navbar */}
      <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
        isScrolled 
          ? 'bg-white/15 backdrop-blur-xl shadow-2xl dark:bg-black/15 border border-white/30 dark:border-white/20 rounded-2xl' 
          : 'bg-white/10 backdrop-blur-lg dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-2xl'
      }`}>
        {/* Content Container */}
        <div className="w-full max-w-7xl mx-auto px-8 py-2">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-primary to-accent p-2 rounded-full">
                  <img 
                    src="/logonew.jpg" 
                    alt="KMPyrotech Logo" 
                    className="h-8 w-8 md:h-10 md:w-10 object-contain rounded-full"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<Sparkles className="h-8 w-8 md:h-10 md:w-10 text-white animate-sparkle" />';
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm md:text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  KMPyrotech
                </span>
                <span className="text-[10px] md:text-xs text-muted-foreground -mt-0.5 opacity-80">
                  Festival Fireworks
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links with Glassmorphism */}
            <div className="hidden md:flex items-center space-x-10">
              <Link 
                to="/" 
                className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group text-sm px-5 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/30 backdrop-blur-sm"
              >
                {t('home')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/categories" 
                className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group text-sm px-5 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/30 backdrop-blur-sm"
              >
                {t('categories')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/track" 
                className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group text-sm px-5 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/30 backdrop-blur-sm"
              >
                {t('trackOrder')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/payment-upload" 
                className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group text-sm px-5 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/30 backdrop-blur-sm"
              >
                Upload Payment
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/about" 
                className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group text-sm px-5 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/30 backdrop-blur-sm"
              >
                {t('aboutUs')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/safety" 
                className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group text-sm px-5 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/30 backdrop-blur-sm"
              >
                {t('safety_Guidance')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            {/* Desktop Actions with Enhanced Glassmorphism */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Location Link */}
              <a 
                href="https://goo.gl/maps/ajVcCJ9UYT9WJWH2A?g_st=aw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group text-sm px-5 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/30 backdrop-blur-sm"
              >
                Location
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </a>
              
              {/* Theme Switcher */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleThemeToggle} 
                className="hover:bg-white/25 dark:hover:bg-black/40 transition-all duration-300 h-10 w-10 rounded-full backdrop-blur-md border border-white/20 dark:border-white/10"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-blue-900 dark:text-yellow-300" />}
              </Button>
              
              <LanguageToggle iconSize={18} />
              
              <NotificationPermission />
              
              <Link to="/cart">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative hover:bg-white/25 dark:hover:bg-black/40 transition-all duration-300 group h-10 w-10 rounded-full backdrop-blur-md border border-white/20 dark:border-white/10"
                >
                  <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  {cartCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-bounce-gentle bg-gradient-to-r from-red-500 to-pink-500"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>

            {/* Mobile Actions - Grouped on the right with more spacing */}
            <div className="md:hidden flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleThemeToggle} 
                className="hover:bg-white/25 dark:hover:bg-black/40 transition-all duration-300 h-9 w-9 rounded-full backdrop-blur-md border border-white/20 dark:border-white/10"
              >
                {isDark ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-blue-900 dark:text-yellow-300" />}
              </Button>
              
              <LanguageToggle iconSize={14} />
              
              <Link to="/cart">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative hover:bg-white/25 dark:hover:bg-black/40 transition-all duration-300 h-9 w-9 rounded-full backdrop-blur-md border border-white/20 dark:border-white/10"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] animate-bounce-gentle bg-gradient-to-r from-red-500 to-pink-500"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="hover:bg-white/25 dark:hover:bg-black/40 transition-all duration-300 h-9 w-9 rounded-full backdrop-blur-md border border-white/20 dark:border-white/10"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu with Enhanced Glassmorphism */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/30 dark:border-white/20 backdrop-blur-xl bg-white/15 dark:bg-black/15 rounded-xl">
              <div className="flex flex-col space-y-3 px-4 pb-4">
                <Link 
                  to="/" 
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-white/25 dark:hover:bg-black/40 text-sm backdrop-blur-md border border-white/10 dark:border-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('home')}
                </Link>
                <Link 
                  to="/categories" 
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-white/25 dark:hover:bg-black/40 text-sm backdrop-blur-md border border-white/10 dark:border-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('categories')}
                </Link>
                <Link 
                  to="/track" 
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-white/25 dark:hover:bg-black/40 text-sm backdrop-blur-md border border-white/10 dark:border-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('trackOrder')}
                </Link>
                <Link 
                  to="/payment-upload" 
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-white/25 dark:hover:bg-black/40 text-sm backdrop-blur-md border border-white/10 dark:border-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Upload Payment
                </Link>
                <Link 
                  to="/about" 
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-white/25 dark:hover:bg-black/40 text-sm backdrop-blur-md border border-white/10 dark:border-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('aboutUs')}
                </Link>
                <Link 
                  to="/safety" 
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-white/25 dark:hover:bg-black/40 text-sm backdrop-blur-md border border-white/10 dark:border-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('safety_Guidance')}
                </Link>
                <a 
                  href="https://goo.gl/maps/ajVcCJ9UYT9WJWH2A?g_st=aw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-white/25 dark:hover:bg-black/40 text-sm backdrop-blur-md border border-white/10 dark:border-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Location
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content from going under the fixed navbar */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};