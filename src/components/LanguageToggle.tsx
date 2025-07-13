import { Button } from "./ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import { Languages } from "lucide-react";

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-2"
    >
      <Languages className="h-4 w-4" />
      <span className="font-medium">
        {language === 'en' ? 'தமிழ்' : 'English'}
      </span>
    </Button>
  );
};