import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "../components/ui/button";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Shield, 
  Star, 
  Clock, 
  CheckCircle, 
  Sparkles,
  Users,
  Award,
  Truck,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const { getTotalItems } = useCart();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={getTotalItems()} />
      
      {/* Hero Section with Diwali Banner */}
      <div className="relative overflow-hidden py-16">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-blue-900 to-purple-800"></div>
        
        {/* Central Semi-Circle */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-48 bg-pink-500 rounded-t-full"></div>
        
        {/* Radiating Flames */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-48 overflow-hidden">
          <div className="relative w-full h-full">
            {/* Pink Flames */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-8 bg-pink-500 rotate-12"></div>
            <div className="absolute top-2 left-1/3 w-2 h-6 bg-pink-500 rotate-6"></div>
            <div className="absolute top-1 right-1/3 w-2 h-7 bg-pink-500 -rotate-8"></div>
            <div className="absolute top-3 left-1/4 w-1 h-5 bg-pink-500 rotate-15"></div>
            <div className="absolute top-2 right-1/4 w-1 h-6 bg-pink-500 -rotate-12"></div>
            
            {/* Teal Flames */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-6 bg-teal-400 rotate-8"></div>
            <div className="absolute top-3 left-2/3 w-2 h-5 bg-teal-400 -rotate-6"></div>
            <div className="absolute top-2 right-2/3 w-2 h-7 bg-teal-400 rotate-10"></div>
            <div className="absolute top-4 left-1/5 w-1 h-4 bg-teal-400 rotate-20"></div>
            <div className="absolute top-1 right-1/5 w-1 h-5 bg-teal-400 -rotate-15"></div>
            
            {/* Yellow Flames */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-7 bg-yellow-400 -rotate-5"></div>
            <div className="absolute top-4 left-3/4 w-2 h-6 bg-yellow-400 rotate-12"></div>
            <div className="absolute top-3 right-3/4 w-2 h-5 bg-yellow-400 -rotate-8"></div>
            <div className="absolute top-5 left-1/6 w-1 h-4 bg-yellow-400 rotate-25"></div>
            <div className="absolute top-2 right-1/6 w-1 h-6 bg-yellow-400 -rotate-18"></div>
          </div>
        </div>
        
        {/* Hanging Diyas */}
        <div className="absolute top-8 left-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-1 h-8 bg-yellow-400"></div>
            <div className="w-4 h-6 bg-yellow-400 rounded-t-full relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-yellow-400"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-16 left-16">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <div className="w-1 h-8 bg-red-600"></div>
            <div className="w-4 h-6 bg-red-600 rounded-t-full relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-red-600"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-8 right-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
            <div className="w-1 h-8 bg-teal-400"></div>
            <div className="w-4 h-6 bg-teal-400 rounded-t-full relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-teal-400"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-16 right-16">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <div className="w-1 h-8 bg-red-600"></div>
            <div className="w-4 h-6 bg-red-600 rounded-t-full relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-red-600"></div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center">
            {/* Happy Diwali Text */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl font-bold mb-2 text-white font-serif">
                Happy
              </h1>
              <h2 className="text-6xl md:text-7xl font-bold mb-4 text-yellow-400 font-serif">
                Diwali
              </h2>
              <p className="text-lg md:text-xl text-white font-medium tracking-wider">
                FESTIVAL OF LIGHTS
              </p>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {t('aboutUs')}
            </h3>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Quality Makes the Belief for Customers
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              KMPyrotech - Your Trusted Fireworks Partner
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              KMPyrotech has been a well-known Fireworks Store in Sivakasi. What started out as a hobby, 
              has become our passion and we're delighted to share it with you. We're proud to have produced 
              years of happy customers and look forward to continuing our work for many more to come!
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              What are you waiting for? Stop by our store today for an exceptional shopping experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" size="lg" asChild>
                <Link to="/categories">
                  View Products
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white/80 rounded-lg">
                  <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Attractive</h3>
                </div>
                <div className="text-center p-4 bg-white/80 rounded-lg">
                  <Zap className="h-8 w-8 text-accent mx-auto mb-2" />
                  <h3 className="font-semibold">Colourful</h3>
                </div>
                <div className="text-center p-4 bg-white/80 rounded-lg">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Manufacturing</h3>
                </div>
                <div className="text-center p-4 bg-white/80 rounded-lg">
                  <Shield className="h-8 w-8 text-accent mx-auto mb-2" />
                  <h3 className="font-semibold">Safety</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-muted/30 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Call to ask any question</h2>
            <div className="flex items-center justify-center gap-2 text-xl font-semibold text-primary">
              <Phone className="h-6 w-6" />
              <span>+91 86086 22755</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Feel Free to Contact us via email:</h3>
              <div className="flex items-center justify-center gap-2 text-primary">
                <Mail className="h-5 w-5" />
                <span>kmcrackers24@gmail.com</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">or phone:</h3>
              <div className="flex items-center justify-center gap-2 text-primary">
                <Phone className="h-5 w-5" />
                <span>+91 86086 22755</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-lg text-muted-foreground">
              Best Sivakasi Crackers Shop
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality</h3>
              <p className="text-muted-foreground">
                KMPyrotech offers only the best and standard quality fireworks products to its customers
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Genuine Price</h3>
              <p className="text-muted-foreground">
                KMPyrotech pricing is considerable and reasonable price with genuine products
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">24X7 Support</h3>
              <p className="text-muted-foreground">
                We provide 24X7 support for all our orders till delivery and our customers can place orders at any time
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Verified</h3>
              <p className="text-muted-foreground">
                We focus on the verified fireworks products and our products will surely blast your ears
              </p>
            </div>
          </div>
        </div>

        {/* Company Description */}
        <div className="bg-muted/30 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">KMPyrotech</h2>
            <h3 className="text-xl text-muted-foreground mb-6">Crackers Shop</h3>
          </div>
          <p className="text-lg text-muted-foreground text-center leading-relaxed max-w-4xl mx-auto">
            We "KMPyrotech" acknowledged as the renowned manufacturer, supplier of an exclusive range of firecrackers. 
            As per 2018 supreme court order, online sale of firecrackers are not permitted! We value our customers and 
            at the same time, respect jurisdiction. We request you to add your products to the cart and submit the required 
            crackers through the enquiry button. We will contact you within 24 hrs and confirm the order through WhatsApp 
            or phone call.
          </p>
        </div>


      </div>

      <Footer />
    </div>
  );
};

export default About; 