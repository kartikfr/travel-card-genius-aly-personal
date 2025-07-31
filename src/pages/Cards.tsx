import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, CreditCard, IndianRupee, ExternalLink, Filter, Search, ArrowLeft } from "lucide-react";
import { ApplicationForm } from "@/components/ApplicationForm";

interface TravelCard {
  id: number;
  name: string;
  nick_name: string;
  rating: number;
  image: string;
  joining_fee_text: string;
  annual_saving: string;
  commission: string;
  commission_type: string;
  card_type: string;
  bank_id: number;
  product_usps: Array<{
    header: string;
    description: string;
  }>;
}

const Cards = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<TravelCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<TravelCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedFeeRange, setSelectedFeeRange] = useState("all");
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  useEffect(() => {
    fetchAllCards();
    // Smooth scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    filterCards();
  }, [cards, searchTerm, selectedBrand, selectedFeeRange]);

  // Separate effect for smooth scrolling on search/filter changes
  useEffect(() => {
    if (cards.length > 0 && (searchTerm || selectedBrand !== "all" || selectedFeeRange !== "all")) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchTerm, selectedBrand, selectedFeeRange, cards.length]);

  const fetchAllCards = async () => {
    try {
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

      if (!response.ok) throw new Error('Failed to fetch cards');
      
      const data = await response.json();
      setCards(data.data?.cards || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCards = () => {
    let filtered = cards;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(card => 
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.nick_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Brand filter (simplified by card type)
    if (selectedBrand !== "all") {
      filtered = filtered.filter(card => 
        card.card_type?.toLowerCase().includes(selectedBrand.toLowerCase())
      );
    }

    // Fee range filter
    if (selectedFeeRange !== "all") {
      filtered = filtered.filter(card => {
        const fee = parseInt(card.joining_fee_text) || 0;
        switch (selectedFeeRange) {
          case "free": return fee === 0;
          case "low": return fee > 0 && fee <= 1000;
          case "medium": return fee > 1000 && fee <= 5000;
          case "high": return fee > 5000;
          default: return true;
        }
      });
    }

    setFilteredCards(filtered);
  };

  const getBrandOptions = () => {
    const brands = [...new Set(cards.map(card => card.card_type).filter(Boolean))];
    return brands;
  };

  const formatCommission = (commission: string, commissionType: string) => {
    if (!commission || commission === "0") return null;
    
    if (commissionType === "percentage") {
      return `${commission}% Cashback`;
    } else {
      return `₹${commission} Reward`;
    }
  };

  const handleApplyNow = (card: any) => {
    setSelectedCard(card);
    setIsApplicationFormOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              Loading Your Travel Card Universe... 🚀
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg border-white/20 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button 
          onClick={() => navigate('/')}
          className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg border-none"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Your Complete Travel Card Collection 🎯
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            {filteredCards.length} Amazing Cards Ready to Transform Your Travel Experience!
          </p>
          
          {/* Claim Reward CTA */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-6 border border-green-400/30">
            <h3 className="text-xl font-bold text-white mb-2">Already Applied for a Card? 🎁</h3>
            <p className="text-gray-300 mb-4">
              Claim your exclusive reward by verifying your application!
            </p>
            <Button 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-8 text-lg"
              onClick={() => navigate('/claim-reward')}
            >
              Claim Your Reward Now! 🎁
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8 border border-white/20">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Find Your Perfect Match</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>

            {/* Brand Filter */}
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Card Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Card Types</SelectItem>
                {getBrandOptions().map(brand => (
                  <SelectItem key={brand} value={brand.toLowerCase()}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Fee Range Filter */}
            <Select value={selectedFeeRange} onValueChange={setSelectedFeeRange}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Annual Fee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Fee Range</SelectItem>
                <SelectItem value="free">Free (₹0)</SelectItem>
                <SelectItem value="low">Low (₹1-1,000)</SelectItem>
                <SelectItem value="medium">Medium (₹1,001-5,000)</SelectItem>
                <SelectItem value="high">Premium (₹5,000+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <Card 
              key={card.id}
              className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
            >
              <CardHeader className="text-center p-4">
                {/* Card Image */}
                <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
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
                    <CreditCard className="h-12 w-12 text-white/50" />
                  )}
                </div>

                <CardTitle className="text-lg text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                  {card.name}
                </CardTitle>
                
                {card.card_type && (
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                    {card.card_type}
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-3 p-4">
                {/* Rating */}
                {card.rating && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Rating:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-bold text-sm">
                        {card.rating}/5
                      </span>
                    </div>
                  </div>
                )}

                {/* Annual Fee */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Annual Fee:</span>
                  <span className="text-white font-bold flex items-center text-sm">
                    <IndianRupee className="h-3 w-3" />
                    {card.joining_fee_text || 'N/A'}
                  </span>
                </div>

                {/* Yearly Savings */}
                {card.annual_saving && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Potential Savings:</span>
                    <span className="text-green-400 font-bold flex items-center text-sm">
                      <IndianRupee className="h-3 w-3" />
                      {card.annual_saving}
                    </span>
                  </div>
                )}

                {/* Commission Info */}
                {formatCommission(card.commission, card.commission_type) && (
                  <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-2 text-center">
                    <span className="text-green-300 text-sm font-medium">
                      Earn {formatCommission(card.commission, card.commission_type)}! 🎉
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 text-sm"
                    onClick={() => handleApplyNow(card)}
                  >
                    Apply Now 🚀
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 text-sm shadow-md border-none"
                    onClick={() => {
                      console.log('Navigating to card detail with ID:', card.id, 'Type:', typeof card.id);
                      navigate(`/card/${card.id}`);
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-white mb-2">Oops! No Cards Found</h3>
            <p className="text-gray-300">Try adjusting your filters to discover more amazing travel cards!</p>
          </div>
        )}
      </div>
      
      {/* Application Form Dialog */}
      <ApplicationForm
        isOpen={isApplicationFormOpen}
        onClose={() => setIsApplicationFormOpen(false)}
        cardName={selectedCard?.name || 'Travel Card'}
      />
    </div>
  );
};

export default Cards;
