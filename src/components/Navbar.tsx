import { Link } from "react-router-dom";
import { ShoppingCart, Sparkles, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { LanguageToggle } from "./LanguageToggle";
import { NotificationPermission } from "./NotificationPermission";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";
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
      <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out w-[98vw] ${
        isScrolled 
          ? 'bg-white/15 backdrop-blur-xl shadow-2xl dark:bg-black/15 border border-white/30 dark:border-white/20 rounded-2xl' 
          : 'bg-white/10 backdrop-blur-lg dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-2xl'
      }`}>
        {/* Content Container */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
              <div className="relative">
                <img 
                  src="/logonew.jpg" 
                  alt="KMPyrotech Logo" 
                  className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 object-cover rounded-full shadow-lg"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<Sparkles className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white animate-sparkle" />';
                    }
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm md:text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  KM PYROTECH
                </span>
                <span className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground -mt-0.5 opacity-80">
                  Festival Fireworks
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              <Link 
                to="/" 
                className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group text-sm px-3 py-2"
              >
                {t('home')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <Link 
                to="/track" 
                className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group text-sm px-3 py-2"
              >
                {t('trackOrder')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/about" 
                className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group text-sm px-3 py-2"
              >
                {t('Contact Us')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/safety" 
                className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group text-sm px-3 py-2"
              >
                {t('safety_Guidance')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/payment-upload" 
                className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group text-sm px-3 py-2"
              >
                Upload Screenshot
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              {/* Location Link */}
              <a 
                href="https://goo.gl/maps/ajVcCJ9UYT9WJWH2A?g_st=aw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group text-sm px-3 py-2"
              >
                Location
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </a>
              
              {/* Theme Switcher */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleThemeToggle} 
                className="hover:bg-white/25 dark:hover:bg-black/40 transition-all duration-300 h-9 w-9 rounded-full backdrop-blur-md border border-white/20 dark:border-white/10"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-blue-900 dark:text-yellow-300" />}
              </Button>
              
              <LanguageToggle iconSize={16} />
              
              <NotificationPermission />
              
              <Link to="/cart">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative hover:bg-white/25 dark:hover:bg-black/40 transition-all duration-300 group h-9 w-9 rounded-full backdrop-blur-md border border-white/20 dark:border-white/10"
                >
                  <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
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
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center space-x-2">
              <Link to="/cart">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative hover:bg-white/25 dark:hover:bg-black/40 transition-all duration-300 h-8 w-8 rounded-full backdrop-blur-md border border-white/20 dark:border-white/10"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-3 w-3 p-0 flex items-center justify-center text-[8px] animate-bounce-gentle bg-gradient-to-r from-red-500 to-pink-500"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleThemeToggle} 
                className="hover:bg-white/25 dark:hover:bg-black/40 transition-all duration-300 h-8 w-8 rounded-full backdrop-blur-md border border-white/20 dark:border-white/10"
              >
                {isDark ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-blue-900 dark:text-yellow-300" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="hover:bg-white/25 dark:hover:bg-black/40 transition-all duration-300 h-8 w-8 rounded-full backdrop-blur-md border border-white/20 dark:border-white/10"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-white/30 dark:border-white/20 backdrop-blur-xl bg-white/15 dark:bg-black/15 rounded-xl">
              <div className="flex flex-col space-y-2 px-2 pb-4">
                <Link 
                  to="/" 
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-2 px-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('home')}
                </Link>
                <Link 
                  to="/categories" 
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-2 px-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('categories')}
                </Link>
                <Link 
                  to="/track" 
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-2 px-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('trackOrder')}
                </Link>
                <Link 
                  to="/payment-upload" 
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-2 px-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Upload Payment
                </Link>
                <Link 
                  to="/about" 
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-2 px-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('aboutUs')}
                </Link>
                <Link 
                  to="/safety" 
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-2 px-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('safety_Guidance')}
                </Link>
                <a 
                  href="https://goo.gl/maps/ajVcCJ9UYT9WJWH2A?g_st=aw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-2 px-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Location
                </a>
                <div className="flex items-center justify-center space-x-4 pt-2 border-t border-white/10 dark:border-white/5">
                  <LanguageToggle iconSize={14} />
                  <NotificationPermission />
                </div>
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