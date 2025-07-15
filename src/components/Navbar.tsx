import { Link } from "react-router-dom";
import { ShoppingCart, Sparkles, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import { Moon, Sun } from "lucide-react";

interface NavbarProps {
  cartCount: number;
}

export const Navbar = ({ cartCount }: NavbarProps) => {
  const { t } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary animate-sparkle" />
              <div className="absolute inset-0 animate-glow">
                <Sparkles className="h-8 w-8 text-accent opacity-60" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text ">
                KM Crackers
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                Festival Fireworks
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t('home')}
            </Link>
            <Link 
              to="/categories" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t('categories')}
            </Link>
            <Link 
              to="/track" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t('trackOrder')}
            </Link>
          </div>

          {/* Language Toggle, Theme Switch, Search and Cart */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Switcher */}
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-yellow-500" />
              <Switch
                checked={resolvedTheme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                aria-label="Toggle dark mode"
              />
              <Moon className="h-4 w-4 text-blue-900 dark:text-yellow-300" />
            </div>
            <LanguageToggle />
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            
            <Link to="/cart">
              <Button variant="cart" size="cart-icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs animate-bounce-gentle"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
          <div className="flex md:hidden items-center space-x-2 mt-2">
            {/* Theme Switcher for mobile */}
            <Sun className="h-4 w-4 text-yellow-500" />
            <Switch
              checked={resolvedTheme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              aria-label="Toggle dark mode"
            />
            <Moon className="h-4 w-4 text-blue-900 dark:text-yellow-300" />
            <LanguageToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};