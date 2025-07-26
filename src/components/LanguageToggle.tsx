import { Button } from "./ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import { Languages } from "lucide-react";

export const LanguageToggle = ({ iconSize = 16 }: { iconSize?: number }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm"
    >
      <Languages className={`w-[${iconSize}px] h-[${iconSize}px]`} />
      <span className="font-medium hidden sm:inline">
        {language === 'en' ? 'தமிழ்' : 'English'}
      </span>
    </Button>
  );
};