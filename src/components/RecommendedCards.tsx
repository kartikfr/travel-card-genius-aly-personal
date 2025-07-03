import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CreditCard, IndianRupee, TrendingUp } from "lucide-react";

interface RecommendedCardsProps {
  cards: any[];
}

export const RecommendedCards = ({ cards }: RecommendedCardsProps) => {
  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Top 6 Travel Cards
          </h2>
          <p className="text-xl text-gray-300">
            Handpicked based on your spending patterns and travel preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.slice(0, 6).map((card, index) => (
            <Card 
              key={index}
              className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
            >
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

                {/* Rating */}
                {card.rating && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Rating:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-bold">
                        {typeof card.rating === 'number' ? card.rating.toFixed(1) : card.rating}
                      </span>
                    </div>
                  </div>
                )}

                {/* Commission Info */}
                {card.commissin && (
                  <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 text-center">
                    <span className="text-green-300 text-sm font-medium">
                      Earn ₹{card.commissin} cashback on approval
                    </span>
                  </div>
                )}

                {/* CTA Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all duration-300"
                  onClick={() => {
                    // This would typically redirect to CashKaro affiliate link
                    window.open('#', '_blank');
                  }}
                >
                  Apply Now
                </Button>

                <p className="text-xs text-gray-400 text-center">
                  *Terms and conditions apply. Approval subject to bank's criteria.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA for more cards */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="border-blue-400/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-300 px-8 py-3"
          >
            View All Travel Cards
          </Button>
        </div>
      </div>
    </section>
  );
};
