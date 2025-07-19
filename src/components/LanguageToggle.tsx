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
      className="flex items-center space-x-2"
    >
      <Languages className={`w-[${iconSize}px] h-[${iconSize}px]`} />
      <span className="font-medium">
        {language === 'en' ? 'தமிழ்' : 'English'}
      </span>
    </Button>
  );
};