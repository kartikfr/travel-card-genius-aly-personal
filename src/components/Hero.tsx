
import { Button } from "@/components/ui/button";
import { Plane, MapPin, Star, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  
  const scrollToCardSelection = () => {
    const element = document.getElementById('card-selection');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Top-right Claim Reward Button */}
      <div className="absolute top-6 right-6 z-20">
        <Button 
          onClick={() => navigate('/claim-reward')}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-full text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-2xl backdrop-blur-sm border border-green-400/30"
        >
          <Gift className="mr-2 h-4 w-4" />
          Claim Your Reward Now! 🎁
        </Button>
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Floating Plane Animation */}
      <div className="absolute top-20 left-0 w-full">
        <div className="animate-float">
          <Plane className="h-8 w-8 text-blue-400 opacity-60" />
        </div>
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-400/30">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-blue-200 font-medium text-sm">Join 50K+ Smart Travelers 🌍</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Stop Overpaying for Travel!
            <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Find Your Dream Card
            </span>
            <span className="block text-2xl md:text-4xl">& Travel Like a Pro ✈️</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Hey fellow wanderer! 👋 Ready to unlock airport lounges, earn free flights, and save thousands on every trip? 
            Let's find the perfect travel credit card that matches your adventure style!
          </p>

          {/* CTA Button */}
          <div className="pt-6">
            <Button 
              onClick={scrollToCardSelection}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full text-base transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Let's Find Your Perfect Match! 🎯
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 max-w-xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-blue-300 text-sm">Travel Cards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">₹2L+</div>
              <div className="text-blue-300 text-sm">Avg. Savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-blue-300 text-sm">Exclusive Perks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};
