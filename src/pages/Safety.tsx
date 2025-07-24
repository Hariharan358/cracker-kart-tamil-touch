import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";

const dos = [
  "Follow Instructions: Display fireworks as per the instructions mentioned on the pack.",
  "Outdoor Use Only: Use fireworks only outdoor.",
  "Use Branded Fireworks: Buy fireworks from authorized/reputed manufacturers only.",
  "Keep Safe Distance: Light only one firework at a time, by one person. Others should watch from a safe distance.",
  "Follow Safety Tips: Always follow the safety tips marked on the fireworks.",
  "Use Agarbatti: Use an agarbatti to ignite the fireworks.",
  "Safe Storage: Store fireworks in a cool and dry place.",
  "Needs Supervision: Always have adult supervision.",
  "Emergency Water: Keep two buckets of water handy. In the event of fire or any mishap."
];

const donts = [
  "Don't make tricks: Never make your own fireworks.",
  "Don't relight: Never try to re-light or pick up fireworks that have not ignited fully.",
  "Don't carry it: Never carry fireworks in your pockets.",
  "Do not use Glass / Metal: Never shoot fireworks in metal or glass containers.",
  "Do not Throw: Never point or throw fireworks at another person.",
  "Don't wear loose clothes: Do not wear loose clothing while using fireworks.",
  "Don't Touch it: After the fireworks display never pick up fireworks that may be leftover, they still may be active.",
  "Don't place near candles: Don't store firecrackers near burning candles or lamps.",
  "Don't Drink & Burst Crackers: Alcohol causes delayed body responses & crackers might burst early."
];

const Safety = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar cartCount={0} />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-primary">Fireworks Safety Guidance</h1>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
          There are certain Dos & Don'ts to follow while purchasing, bursting and storing crackers. Thus, it is very important to follow the precautions while bursting crackers. A little negligence, ignorance and carelessness can cause a fatal injury.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-green-600 dark:text-green-300 h-7 w-7" /> Do's
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
              <XCircle className="text-red-600 dark:text-red-300 h-7 w-7" /> Don'ts
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
            <Link to="/categories">Back to Shopping</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Safety; 