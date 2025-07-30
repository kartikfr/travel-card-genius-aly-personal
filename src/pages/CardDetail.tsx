import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, CreditCard, IndianRupee, ExternalLink, Gift, Plane, Hotel, Coffee } from "lucide-react";
import { ApplicationForm } from "@/components/ApplicationForm";

interface TravelCard {
  id: number;
  name: string;
  nick_name: string;
  rating: number;
  user_rating_count?: number;
  image: string;
  joining_fee_text: string;
  annual_saving: string;
  commission: string;
  commission_type: string;
  card_type: string;
  reward_conversion_rate?: string;
  tags?: Array<{
    id: number;
    name: string;
    bk_product_tags?: string;
  }>;
  product_usps: Array<{
    header: string;
    description: string;
  }>;
  welcome_benefits: Array<{
    header: string;
    description: string;
  }>;
  travel_benefits: Array<{
    header: string;
    description: string;
  }>;
  reward_benefits: Array<{
    header: string;
    description: string;
  }>;
}

const CardDetail = () => {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState<TravelCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);

  useEffect(() => {
    console.log('🔄 useEffect triggered with cardId:', cardId);
    if (cardId) {
      fetchCardDetails();
    }
  }, [cardId]);

  const fetchCardDetails = async () => {
    try {
      console.log('🔍 Starting fetchCardDetails for cardId:', cardId);
      setLoading(true);
      setCard(null);
      
      const response = await fetch('https://bk-api.bankkaro.com/sp/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: "best-travel-credit-card",
          banks_ids: [],
          card_networks: [],
          annualFees: "",
          credit_score: "",
          sort_by: "",
          free_cards: "",
          eligiblityPayload: {},
          cardGeniusPayload: {}
        })
      });

      console.log('📡 API Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        console.error('❌ API error:', response.status, response.statusText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Full API response:', data);
      
      const cards = data?.data?.cards || data?.cards || [];
      console.log('🎴 Cards array length:', cards.length);
      console.log('🎴 First few cards:', cards.slice(0, 3));
      
      if (!Array.isArray(cards) || cards.length === 0) {
        console.error('❌ No cards found in API response');
        setCard(null);
        setLoading(false);
        return;
      }
      
      // Log all card IDs for debugging
      const cardIds = cards.map((c: any) => c.id);
      console.log('🆔 Available card IDs:', cardIds);
      console.log('🔍 Looking for card ID:', cardId, 'Type:', typeof cardId);
      
      // Try to find the card by id (string or number)
      let foundCard = cards.find((c: any) => {
        const match = c.id?.toString() === cardId?.toString();
        if (match) console.log('✅ Matched card by string:', c.id, cardId);
        return match;
      });
      
      if (!foundCard) {
        foundCard = cards.find((c: any) => {
          const match = c.id == cardId;
          if (match) console.log('✅ Matched card by loose equality:', c.id, cardId);
          return match;
        });
      }
      
      if (!foundCard) {
        console.error('❌ No card matched for ID:', cardId);
        console.log('🔍 Available IDs:', cardIds);
        setCard(null);
      } else {
        console.log('✅ Found card:', foundCard);
        setCard(foundCard);
      }
    } catch (error) {
      console.error('❌ Error in fetchCardDetails:', error);
      setCard(null);
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };

  const formatCommission = (commission: string, commissionType: string) => {
    if (!commission || commission === "0") return null;
    
    if (commissionType === "percentage") {
      return `${commission}% Cashback`;
    } else {
      return `₹${commission}`;
    }
  };

  const handleApplyNow = () => {
    setIsApplicationFormOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Loading Card Details...</h1>
            <p className="text-gray-300">Card ID: {cardId}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="w-full h-64 rounded-lg bg-white/20"></div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-white/20 rounded"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 bg-white/20 rounded"></div>
                  <div className="h-16 bg-white/20 rounded"></div>
                  <div className="h-16 bg-white/20 rounded"></div>
                  <div className="h-16 bg-white/20 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Card Not Found</h1>
          <p className="text-gray-300 mb-6">
            Card ID: {cardId} - Could not be found in the database.
          </p>
          <div className="space-y-4">
            <Button onClick={() => navigate('/cards')} className="bg-gradient-to-r from-blue-600 to-purple-600 mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cards
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-400/50 text-blue-300 hover:bg-blue-500/20"
              onClick={() => {
                // For testing - show a sample card
                const sampleCard = {
                  id: parseInt(cardId || '75'),
                  name: 'HDFC Infinia Credit Card',
                  nick_name: 'HDFC Infinia',
                  rating: 4.8,
                  user_rating_count: 1250,
                  image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop',
                  joining_fee_text: '₹12,500',
                  annual_saving: '₹50,000',
                  commission: '1000',
                  commission_type: 'fixed',
                  card_type: 'Premium',
                  reward_conversion_rate: '1 point = ₹0.30',
                  tags: [
                    { id: 1, name: 'Premium', bk_product_tags: 'premium' },
                    { id: 2, name: 'Travel', bk_product_tags: 'travel' },
                    { id: 3, name: 'Lounge Access', bk_product_tags: 'lounge' },
                    { id: 4, name: 'No Forex', bk_product_tags: 'no_forex' }
                  ],
                  product_usps: [
                    { header: 'Unlimited Lounge Access', description: 'Access to 1000+ lounges worldwide including guest access' },
                    { header: 'No Foreign Transaction Fees', description: 'Zero forex markup on international transactions' },
                    { header: 'Comprehensive Travel Insurance', description: 'Up to ₹1 Crore travel insurance coverage' }
                  ],
                  welcome_benefits: [
                    { header: 'Welcome Bonus', description: '50,000 bonus points on first spend of ₹50,000' },
                    { header: 'First Year Fee Waiver', description: 'Joining fee waived on spends of ₹10 lakhs' }
                  ],
                  travel_benefits: [
                    { header: 'Airport Lounge Access', description: 'Unlimited complimentary access to domestic and international lounges' },
                    { header: 'Travel Insurance', description: 'Comprehensive travel insurance up to ₹1 Crore' },
                    { header: 'Concierge Services', description: '24/7 premium concierge services for travel bookings' }
                  ],
                  reward_benefits: [
                    { header: 'Reward Points', description: 'Earn 4X points on travel spends, 2X on dining and entertainment' },
                    { header: 'Point Redemption', description: 'Redeem points for flights, hotels, and statement credits' }
                  ]
                };
                setCard(sampleCard);
              }}
            >
              Load Sample Card (Testing)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button 
          onClick={() => navigate('/cards')}
          className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg border-none"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cards
        </Button>

        {/* Card Header */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
          <CardHeader className="pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card Image */}
              <div className="lg:col-span-1">
                <div className="w-full h-64 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  {card.image ? (
                    <img 
                      src={card.image} 
                      alt={card.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <CreditCard className="h-16 w-16 text-white/50" />
                  )}
                </div>
              </div>

              {/* Card Info */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <CardTitle className="text-3xl text-white mb-2 flex items-center flex-wrap gap-2">
                    {card.name}
                    {/* Tags as badges */}
                    {card.tags && card.tags.length > 0 && (
                      <span className="flex flex-wrap gap-2 ml-2">
                        {card.tags.map((tag, idx) => (
                          <Badge key={idx} className="bg-purple-600/20 text-purple-200 border-purple-400/30 text-xs font-semibold px-2 py-1">
                            {tag.name}
                          </Badge>
                        ))}
                      </span>
                    )}
                  </CardTitle>
                  {card.card_type && (
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-400/30 ml-1">
                      {card.card_type}
                    </Badge>
                  )}
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Joining Fee */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-gray-300 text-sm mb-1">Joining Fee</h4>
                    <p className="text-white font-bold flex items-center">
                      <IndianRupee className="h-4 w-4" />
                      {card.joining_fee_text || 'N/A'}
                    </p>
                  </div>

                  {/* Rating + Count */}
                  {(card.rating || card.user_rating_count) && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-gray-300 text-sm mb-1">Customer Rating</h4>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-bold text-lg">{card.rating}/5</span>
                        {card.user_rating_count && (
                          <span className="text-gray-400 text-xs">({card.user_rating_count} reviews)</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Commission Reward */}
                  {formatCommission(card.commission, card.commission_type) && (
                    <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                      <h4 className="text-green-300 text-sm mb-1">Your Reward</h4>
                      <p className="text-green-300 font-bold flex items-center">
                        <Gift className="h-4 w-4 mr-1" />
                        Earn {formatCommission(card.commission, card.commission_type)}!
                      </p>
                    </div>
                  )}

                  {/* Reward Conversion Rate */}
                  {card.reward_conversion_rate && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-gray-300 text-sm mb-1">Reward Conversion Rate</h4>
                      <p className="text-purple-300 font-bold flex items-center">
                        <span className="mr-1">{card.reward_conversion_rate}</span>
                      </p>
                    </div>
                  )}

                  {/* Annual Savings */}
                  {card.annual_saving && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-gray-300 text-sm mb-1">Potential Annual Savings</h4>
                      <p className="text-green-400 font-bold flex items-center">
                        <IndianRupee className="h-4 w-4" />
                        {card.annual_saving}
                      </p>
                    </div>
                  )}
                </div>

                {/* Apply Button */}
                <Button 
                  className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 text-lg"
                  onClick={handleApplyNow}
                >
                  Apply Now & Earn Your Reward! 🚀
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Benefits Sections */}
        <div className="space-y-8">
          {/* Product USPs */}
          {card.product_usps && card.product_usps.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-400" />
                Top Features
              </h2>
              <div className="space-y-4">
                {card.product_usps.map((usp, index) => (
                  <div key={index} className="w-full bg-white/10 rounded-lg p-4 shadow-md border border-white/10">
                    <h4 className="text-blue-300 font-semibold mb-1 text-base">{usp.header}</h4>
                    <p className="text-gray-300 text-sm">{usp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Welcome Benefits */}
          {card.welcome_benefits && card.welcome_benefits.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Gift className="h-5 w-5 mr-2 text-green-400" />
                Welcome Benefits
              </h2>
              <div className="space-y-4">
                {card.welcome_benefits.map((benefit, index) => (
                  <div key={index} className="w-full bg-white/10 rounded-lg p-4 shadow-md border border-white/10">
                    <h4 className="text-green-300 font-semibold mb-1 text-base">{benefit.header}</h4>
                    <p className="text-gray-300 text-sm">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Travel Benefits */}
          {card.travel_benefits && card.travel_benefits.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Plane className="h-5 w-5 mr-2 text-blue-400" />
                Travel Benefits
              </h2>
              <div className="space-y-4">
                {card.travel_benefits.map((benefit, index) => (
                  <div key={index} className="w-full bg-white/10 rounded-lg p-4 shadow-md border border-white/10">
                    <h4 className="text-blue-300 font-semibold mb-1 text-base">{benefit.header}</h4>
                    <p className="text-gray-300 text-sm">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reward Benefits */}
          {card.reward_benefits && card.reward_benefits.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <IndianRupee className="h-5 w-5 mr-2 text-purple-400" />
                Reward Benefits
              </h2>
              <div className="space-y-4">
                {card.reward_benefits.map((benefit, index) => (
                  <div key={index} className="w-full bg-white/10 rounded-lg p-4 shadow-md border border-white/10">
                    <h4 className="text-purple-300 font-semibold mb-1 text-base">{benefit.header}</h4>
                    <p className="text-gray-300 text-sm">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Final CTA */}
        <div className="text-center mt-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Travel Experience?</h3>
          <p className="text-gray-300 mb-6">
            Join thousands of smart travelers who are already saving big with this card!
          </p>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 text-lg"
            onClick={handleApplyNow}
          >
            Apply Now & Start Saving! 💫
          </Button>
        </div>
      </div>
      
      {/* Application Form Dialog */}
      <ApplicationForm
        isOpen={isApplicationFormOpen}
        onClose={() => setIsApplicationFormOpen(false)}
        cardName={card?.name || 'Travel Card'}
      />
    </div>
  );
};

export default CardDetail;