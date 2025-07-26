import { Link } from "react-router-dom";
import { ShoppingCart, Sparkles, Search, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { LanguageToggle } from "./LanguageToggle";
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
      <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out navbar-glass-effect ${
        isScrolled 
          ? 'w-[95%] max-w-6xl rounded-2xl shadow-2xl' 
          : 'w-[98%] max-w-7xl rounded-3xl shadow-lg'
      }`}>
        {/* Glassmorphism Background */}
        <div className={`
          relative overflow-hidden rounded-2xl border border-white/20
          ${isScrolled 
            ? 'bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]' 
            : 'bg-white/8 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.08)]'
          }
          dark:border-white/10 dark:bg-black/20
          ${isScrolled 
            ? 'dark:bg-black/30 dark:backdrop-blur-xl' 
            : 'dark:bg-black/15 dark:backdrop-blur-md'
          }
        `}>
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 animate-gradient-x navbar-shimmer"></div>
          
          {/* Subtle Border Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-30"></div>
          
          {/* Content Container */}
          <div className="relative px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo with Enhanced Animation */}
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-primary to-accent p-2 rounded-full">
                    <Sparkles className="h-6 w-6 text-white animate-sparkle" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    KMPyrotech
                  </span>
                  <span className="text-[10px] text-muted-foreground -mt-1 opacity-80">
                    Festival Fireworks
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center space-x-8">
                <Link 
                  to="/" 
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group"
                >
                  {t('home')}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/categories" 
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group"
                >
                  {t('categories')}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/track" 
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group"
                >
                  {t('trackOrder')}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/about" 
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group"
                >
                  {t('aboutUs')}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/safety" 
                  className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group"
                >
                  {t('safety_Guidance')}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-3">
                {/* Theme Switcher */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleThemeToggle} 
                  className="hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-300"
                  aria-label="Toggle dark mode"
                >
                  {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-blue-900 dark:text-yellow-300" />}
                </Button>
                
                <LanguageToggle iconSize={16} />
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-300"
                >
                  <Search className="h-5 w-5" />
                </Button>
                
                <Link to="/cart">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-300 group"
                  >
                    <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    {cartCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs animate-bounce-gentle bg-gradient-to-r from-red-500 to-pink-500"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleThemeToggle} 
                  className="hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-300"
                >
                  {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-blue-900 dark:text-yellow-300" />}
                </Button>
                
                <LanguageToggle iconSize={14} />
                
                <Link to="/cart">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-300"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs animate-bounce-gentle bg-gradient-to-r from-red-500 to-pink-500"
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
                  className="hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-300"
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden mt-4 pt-4 border-t border-white/10 dark:border-white/5">
                <div className="flex flex-col space-y-3">
                  <Link 
                    to="/" 
                    className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-2 px-3 rounded-lg hover:bg-white/5 dark:hover:bg-black/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('home')}
                  </Link>
                  <Link 
                    to="/categories" 
                    className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-2 px-3 rounded-lg hover:bg-white/5 dark:hover:bg-black/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('categories')}
                  </Link>
                  <Link 
                    to="/track" 
                    className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-2 px-3 rounded-lg hover:bg-white/5 dark:hover:bg-black/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('trackOrder')}
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-2 px-3 rounded-lg hover:bg-white/5 dark:hover:bg-black/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('aboutUs')}
                  </Link>
                  <Link 
                    to="/safety" 
                    className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium py-2 px-3 rounded-lg hover:bg-white/5 dark:hover:bg-black/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('safety_Guidance')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under the fixed navbar */}
      <div className="h-24"></div>
    </>
  );
};