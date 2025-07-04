import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CreditCard, IndianRupee, TrendingUp, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";

interface RecommendedCardsProps {
  cards: any[];
  userPreferences?: any;
}

// Add a helper to calculate net saving
const calculateNetSaving = (card: any) => {
  const total = card.total_saving_yearly || card.total_savings_yearly || 0;
  const fee = card.joining_fees || 0;
  return total - fee;
};

export const recommendedCardsRef = { current: null as HTMLDivElement | null };

export const RecommendedCards = ({ cards, userPreferences }: RecommendedCardsProps) => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    recommendedCardsRef.current = sectionRef.current;
  }, []);

  if (!cards || cards.length === 0) {
    return null;
  }

  const handleViewDetails = (selectedCardIndex: number) => {
    // Navigate to the detailed breakdown page with all cards data
    navigate('/card-breakdown', { 
      state: { 
        cards: cards.slice(0, 6),
        userPreferences: userPreferences,
        selectedCardIndex: selectedCardIndex
      } 
    });
  };

  return (
    <section ref={sectionRef} className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Top 6 Travel Cards 💰
          </h2>
          <p className="text-xl text-gray-300 mb-4">
            Handpicked based on your spending patterns with exclusive rewards on approval
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
              <span>Top 3 - Best Matches</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
              <span>Great Alternatives</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.slice(0, 6).map((card, index) => (
            <Card 
              key={index}
              className={`bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group relative ${
                index < 3 ? 'ring-2 ring-yellow-400/30' : ''
              }`}
            >
              {/* Priority Badge */}
              <div className="absolute -top-3 -left-3 z-10 flex items-center space-x-2">
                <div className={`text-white font-bold text-lg w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 ${
                  index < 3 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}>
                  #{index + 1}
                </div>
                <div className="bg-green-500/90 text-white font-bold text-xs px-3 py-1 rounded-full shadow border border-green-400/50">
                  Net Saving: ₹{calculateNetSaving(card).toLocaleString()}
                </div>
              </div>
              <CardHeader className="text-center">
                {/* Card Image */}
                {card.image && (
                  <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <img 
                      src={card.image} 
                      alt={card.name || card.card_name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {!card.image && (
                      <CreditCard className="h-16 w-16 text-white/50" />
                    )}
                  </div>
                )}

                <CardTitle className="text-xl text-white group-hover:text-blue-300 transition-colors">
                  {card.name || card.card_name || 'Premium Travel Card'}
                </CardTitle>
                <div className={`text-sm font-medium ${
                  index < 3 ? 'text-yellow-400' : 'text-blue-400'
                }`}>
                  Priority Rank #{index + 1}
                </div>
                
                {card.card_type && (
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                    {card.card_type}
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Annual Fee */}
                {card.joining_fees !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Annual Fee:</span>
                    <span className="text-white font-bold flex items-center">
                      <IndianRupee className="h-4 w-4" />
                      {card.joining_fees === 0 ? 'FREE' : card.joining_fees?.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Yearly Savings */}
                {card.total_saving_yearly !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Yearly Savings:</span>
                    <span className="text-green-400 font-bold flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <IndianRupee className="h-4 w-4" />
                      {card.total_saving_yearly?.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Lounge Access Information */}
                {card.travel_benefits && (
                  <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-3 space-y-2">
                    <div className="text-blue-300 text-sm font-medium text-center">Lounge Access</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-gray-300">Domestic</div>
                        <div className="text-white font-bold">
                          {card.travel_benefits.domestic_lounges_unlocked || 0} visits
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-300">International</div>
                        <div className="text-white font-bold">
                          {card.travel_benefits.international_lounges_unlocked || 0} visits
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reward (Commission) */}
                {card.commission && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Reward:</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-bold">
                        {card.commission_type === 'percentage' 
                          ? `${card.commission}% Cashback`
                          : `₹${card.commission} Reward`
                        }
                      </span>
                    </div>
                  </div>
                )}

                {/* Commission Info - Enhanced Display */}
                {card.commission && (
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-lg p-4 text-center">
                    <div className="text-green-300 text-sm font-medium mb-1">
                      💰 Your Reward on Approval
                    </div>
                    <div className="text-green-400 font-bold text-lg">
                      {card.commission_type === 'percentage' 
                        ? `${card.commission}% Cashback`
                        : `₹${card.commission} Reward`
                      }
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      Apply through us & earn instantly!
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300"
                  onClick={() => {
                    // This would typically redirect to CashKaro affiliate link
                    window.open('#', '_blank');
                  }}
                >
                  {card.commission ? `Apply & Earn ₹${card.commission}` : 'Apply Now'}
                </Button>

                {/* View Details Button */}
                <Button 
                  variant="outline"
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 text-sm shadow-md border-none"
                  onClick={() => handleViewDetails(index)}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Details
                </Button>

                <p className="text-xs text-gray-400 text-center">
                  *Terms and conditions apply. Approval subject to bank's criteria.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>        
      </div>
    </section>
  );
};
