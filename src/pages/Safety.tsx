import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";

const Safety = () => {
  const { t } = useLanguage();
  
  // Safety Do's with translation keys
  const dos = [
    t('followInstructions'),
    t('outdoorUseOnly'),
    t('useBrandedFireworks'),
    t('keepSafeDistance'),
    t('followSafetyTips'),
    t('useAgarbatti'),
    t('safeStorage'),
    t('needsSupervision'),
    t('emergencyWater')
  ];

  // Safety Don'ts with translation keys
  const donts = [
    t('dontMakeTricks'),
    t('dontRelight'),
    t('dontCarryIt'),
    t('dontUseGlassMetal'),
    t('dontThrow'),
    t('dontWearLooseClothes'),
    t('dontTouchIt'),
    t('dontPlaceNearCandles'),
    t('dontDrinkAndBurst')
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar cartCount={0} />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-primary">
          {t('safetyGuidance')}
        </h1>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
          {t('safetyDescription')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-green-600 dark:text-green-300 h-7 w-7" /> 
              {t('dos')}
            </h2>
            <ul className="list-none pl-0 space-y-2">
              {dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-base text-green-900 dark:text-green-100">
                  <CheckCircle2 className="mt-1 text-green-500 dark:text-green-300 h-5 w-5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-red-700 dark:text-red-300 mb-4 flex items-center gap-2">
              <XCircle className="text-red-600 dark:text-red-300 h-7 w-7" /> 
              {t('donts')}
            </h2>
            <ul className="list-none pl-0 space-y-2">
              {donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-base text-red-900 dark:text-red-100">
                  <XCircle className="mt-1 text-red-500 dark:text-red-300 h-5 w-5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center mt-10">
          <Button asChild variant="outline">
            <Link to="/categories">{t('backToShopping')}</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Safety; 