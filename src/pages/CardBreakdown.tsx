import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CreditCard, 
  IndianRupee, 
  TrendingUp, 
  Calculator,
  Plane,
  Hotel,
  Gift,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  Star,
  Target,
  Zap
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const CardBreakdown = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedLevels, setExpandedLevels] = useState<{ [key: string]: boolean }>({});
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { cards = [], userPreferences, selectedCardIndex = 0 } = location.state || {};

  useEffect(() => {
    if (!cards || cards.length === 0) {
      navigate('/');
      return;
    }

    // Debug: Log the cards data structure
    console.log('🔍 CardBreakdown - Cards data:', cards);
    console.log('🔍 CardBreakdown - User preferences:', userPreferences);
    console.log('🔍 CardBreakdown - Selected card index:', selectedCardIndex);
    if (cards.length > 0) {
      console.log('🔍 Sample card structure:', cards[0]);
      console.log('🔍 Sample card spending_categories:', cards[0]?.spending_categories);
      console.log('🔍 Sample card flights_annual:', cards[0]?.spending_categories?.flights_annual);
      console.log('🔍 Sample card hotels_annual:', cards[0]?.spending_categories?.hotels_annual);
      console.log('🔍 Sample card redemption_options:', cards[0]?.redemption_options);
    }

    // Auto-expand the selected card (the one user clicked on)
    setExpandedCards({ [selectedCardIndex]: true });
    // Auto-expand Level 1 for the selected card
    setExpandedLevels({ [`${selectedCardIndex}-level1`]: true });
    // Scroll to the selected card
    setTimeout(() => {
      if (cardRefs.current[selectedCardIndex]) {
        cardRefs.current[selectedCardIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  }, [cards, navigate, selectedCardIndex]);

  const toggleLevel = (cardIndex: number, level: string) => {
    const key = `${cardIndex}-${level}`;
    setExpandedLevels(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleCard = (cardIndex: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardIndex]: !prev[cardIndex]
    }));
  };

  const calculateNetSaving = (card: any) => {
    const totalSavings = card.total_saving_yearly || card.total_savings_yearly || 0;
    const joiningFees = card.joining_fees || 0;
    const netSaving = totalSavings - joiningFees;
    console.log(`💰 Net saving calculation for ${card.card_name || card.name}:`, {
      totalSavings,
      joiningFees,
      netSaving
    });
    return netSaving;
  };

  const calculateFlightSavings = (card: any) => {
    const flightsAnnual = card.spending_breakdown?.flights_annual;
    if (!flightsAnnual) {
      console.log(`✈️ No flights_annual data for card: ${card.card_name || card.name}`);
      return 0;
    }
    
    const monthlySavings = flightsAnnual.savings || 0;
    const annualSavings = monthlySavings * 12;
    
    console.log(`✈️ Flight savings calculation for ${card.card_name || card.name}:`, {
      monthlySavings,
      annualSavings
    });
    
    return annualSavings;
  };

  const calculateHotelSavings = (card: any) => {
    const hotelsAnnual = card.spending_breakdown?.hotels_annual;
    if (!hotelsAnnual) {
      console.log(`🏨 No hotels_annual data for card: ${card.card_name || card.name}`);
      return 0;
    }
    
    const monthlySavings = hotelsAnnual.savings || 0;
    const annualSavings = monthlySavings * 12;
    
    console.log(`🏨 Hotel savings calculation for ${card.card_name || card.name}:`, {
      monthlySavings,
      annualSavings
    });
    
    return annualSavings;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPersonalizedHeading = () => {
    if (!userPreferences) return "Your Travel Card Breakdown";
    
    const hotelSpending = userPreferences.hotels_annual?.[0] || 0;
    const flightSpending = userPreferences.flights_annual?.[0] || 0;
    
    if (hotelSpending > 100000 && flightSpending > 100000) {
      return "Your Premium Travel Card Analysis 🏨✈️";
    } else if (hotelSpending > 50000 || flightSpending > 75000) {
      return "Your Smart Travel Card Breakdown 💰";
    } else {
      return "Your Travel Card Savings Analysis 📊";
    }
  };

  const getPersonalizedSubheading = () => {
    if (!userPreferences) return "Detailed analysis of your top 6 travel cards with complete mathematical breakdown";
    
    const hotelSpending = userPreferences.hotels_annual?.[0] || 0;
    const flightSpending = userPreferences.flights_annual?.[0] || 0;
    
    return `Based on your annual spending: ${formatCurrency(hotelSpending)} on hotels & ${formatCurrency(flightSpending)} on flights`;
  };

  // Group redemption options by method
  const groupRedemptionOptionsByMethod = (options: any[]) => {
    const grouped: { [method: string]: any[] } = {};
    options.forEach(option => {
      if (!option.method) return;
      if (!grouped[option.method]) grouped[option.method] = [];
      grouped[option.method].push(option);
    });
    return grouped;
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">No Cards Found</h1>
          <p className="text-gray-300 mb-6">Please go back and generate your recommendations first.</p>
          <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-blue-600 to-purple-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Calculator
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => navigate('/')}
            className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg border-none"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Calculator
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {getPersonalizedHeading()}
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              {getPersonalizedSubheading()}
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400 flex-wrap">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Level 1 - Net Savings</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Level 2 - Detailed Breakdown</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>Level 3 - Category Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Redemption Options</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="space-y-8">
          {cards.map((card, cardIndex) => (
            <Card 
              key={cardIndex}
              ref={el => cardRefs.current[cardIndex] = el}
              className={`mb-8 bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:bg-white/10 ${expandedCards[cardIndex] ? 'ring-2 ring-blue-400/40' : ''}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`text-white font-bold text-xl w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 ${
                      cardIndex < 3 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600'
                    }`}>
                      #{cardIndex + 1}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {card.image && (
                        <div className="w-20 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                          <img 
                            src={card.image} 
                            alt={card.name || card.card_name}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {card.name || card.card_name || 'Premium Travel Card'}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <p className="text-gray-300">
                            Priority Rank #{cardIndex + 1} • {card.card_type || 'Travel Card'}
                          </p>
                          {cardIndex === selectedCardIndex && (
                            <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                              <Target className="h-3 w-3 mr-1" />
                              Selected
                            </Badge>
                          )}
                        </div>
                        {/* Debug info */}
                        <div className="text-xs text-gray-400 mt-1">
                          Total Savings: {card.total_saving_yearly || card.total_savings_yearly || 'N/A'} |
                          Joining Fees: {card.joining_fees || 'N/A'} |
                          Flight Data: {card.spending_breakdown?.flights_annual ? (
                            <span className="text-blue-400 font-bold">{formatCurrency(calculateFlightSavings(card))}</span>
                          ) : (
                            <span className="text-gray-500">No</span>
                          )} |
                          Hotel Data: {card.spending_breakdown?.hotels_annual ? (
                            <span className="text-purple-400 font-bold">{formatCurrency(calculateHotelSavings(card))}</span>
                          ) : (
                            <span className="text-gray-500">No</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-500 text-white font-bold rounded-lg shadow hover:from-blue-700 hover:to-purple-600 transition-all duration-150 border-none px-4 py-2"
                    onClick={() => toggleCard(cardIndex)}
                  >
                    {expandedCards[cardIndex] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {expandedCards[cardIndex] ? 'Collapse' : 'Expand'}
                  </Button>
                </div>
              </CardHeader>

              {expandedCards[cardIndex] && (
                <CardContent className="space-y-6">
                  {/* Level 1: Net Savings */}
                  <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-green-300 flex items-center">
                        <Calculator className="h-5 w-5 mr-2" />
                        Level 1: Net Savings Breakdown
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-500 text-white font-bold rounded-lg shadow hover:from-blue-700 hover:to-purple-600 transition-all duration-150 border-none px-4 py-2"
                        onClick={() => toggleLevel(cardIndex, 'level1')}
                      >
                        {expandedLevels[`${cardIndex}-level1`] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        {expandedLevels[`${cardIndex}-level1`] ? 'Hide Details' : 'View Details'}
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <h5 className="text-gray-300 text-sm mb-1">Total Annual Savings</h5>
                        <p className="text-green-400 font-bold text-lg">
                          {card.total_saving_yearly || card.total_savings_yearly ? formatCurrency(card.total_saving_yearly || card.total_savings_yearly) : 'Not available'}
                        </p>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4">
                        <h5 className="text-gray-300 text-sm mb-1">Joining Fees</h5>
                        <p className="text-red-400 font-bold text-lg">
                          {card.joining_fees !== undefined ? formatCurrency(card.joining_fees) : 'Not available'}
                        </p>
                      </div>
                      
                      <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                        <h5 className="text-green-300 text-sm mb-1">Net Savings</h5>
                        <p className="text-green-300 font-bold text-xl">
                          {(card.total_saving_yearly || card.total_savings_yearly) && card.joining_fees !== undefined ? formatCurrency(calculateNetSaving(card)) : 'Not available'}
                        </p>
                        <p className="text-xs text-green-400">
                          Calculated: {(card.total_saving_yearly || card.total_savings_yearly) && card.joining_fees !== undefined ? formatCurrency(calculateNetSaving(card)) : 'Not available'}
                        </p>
                      </div>
                    </div>

                    {expandedLevels[`${cardIndex}-level1`] && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <h6 className="text-white font-semibold mb-2">Calculation:</h6>
                        <div className="text-gray-300 text-sm space-y-1">
                          <p>Net Savings = Total Annual Savings - Joining Fees</p>
                          <p>Net Savings = {formatCurrency(card.total_saving_yearly || card.total_savings_yearly || 0)} - {formatCurrency(card.joining_fees || 0)}</p>
                          <p className="text-green-400 font-bold">Net Savings = {formatCurrency(calculateNetSaving(card))}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Level 2: Detailed Breakdown */}
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-blue-300 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Level 2: Detailed Savings Breakdown
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-500 text-white font-bold rounded-lg shadow hover:from-blue-700 hover:to-purple-600 transition-all duration-150 border-none px-4 py-2"
                        onClick={() => toggleLevel(cardIndex, 'level2')}
                      >
                        {expandedLevels[`${cardIndex}-level2`] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        {expandedLevels[`${cardIndex}-level2`] ? 'Hide Details' : 'View Details'}
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <h5 className="text-gray-300 text-sm mb-1 flex items-center">
                          <Plane className="h-4 w-4 mr-1" />
                          Flight Savings
                        </h5>
                        <p className="text-blue-400 font-bold text-lg">
                          {card.spending_breakdown?.flights_annual ? formatCurrency(calculateFlightSavings(card)) : 'Not available'}
                        </p>
                        {card.spending_breakdown?.flights_annual && (
                          <div className="text-xs text-gray-400 space-y-1">
                            <p>Monthly: {formatCurrency(card.spending_breakdown.flights_annual.savings || 0)} × 12</p>
                            <p>Calculation: {card.spending_breakdown.flights_annual.points_earned?.toLocaleString() || 0} × ₹{card.spending_breakdown.flights_annual.conv_rate || 0}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4">
                        <h5 className="text-gray-300 text-sm mb-1 flex items-center">
                          <Hotel className="h-4 w-4 mr-1" />
                          Hotel Savings
                        </h5>
                        <p className="text-blue-400 font-bold text-lg">
                          {card.spending_breakdown?.hotels_annual ? formatCurrency(calculateHotelSavings(card)) : 'Not available'}
                        </p>
                        {card.spending_breakdown?.hotels_annual && (
                          <div className="text-xs text-gray-400 space-y-1">
                            <p>Monthly: {formatCurrency(card.spending_breakdown.hotels_annual.savings || 0)} × 12</p>
                            <p>Calculation: {card.spending_breakdown.hotels_annual.points_earned?.toLocaleString() || 0} × ₹{card.spending_breakdown.hotels_annual.conv_rate || 0}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4">
                        <h5 className="text-gray-300 text-sm mb-1">Extra Benefits</h5>
                        <p className="text-purple-400 font-bold text-lg">
                          {card.total_extra_benefits !== undefined ? formatCurrency(card.total_extra_benefits) : 'Not available'}
                        </p>
                      </div>
                      
                      <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                        <h5 className="text-blue-300 text-sm mb-1">Total Annual Savings</h5>
                        <p className="text-blue-300 font-bold text-xl">
                          {card.total_saving_yearly || card.total_savings_yearly ? formatCurrency(card.total_saving_yearly || card.total_savings_yearly) : 'Not available'}
                        </p>
                      </div>
                    </div>

                    {expandedLevels[`${cardIndex}-level2`] && (
                      <div className="bg-white/5 rounded-lg p-4 mb-4">
                        <h5 className="text-gray-300 text-sm mb-3">Calculation Breakdown</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Flight Savings (Annual):</span>
                            <span className="text-blue-400">
                              {card.spending_breakdown?.flights_annual ? 
                                `${formatCurrency(card.spending_breakdown.flights_annual.savings || 0)} × 12 = ${formatCurrency(calculateFlightSavings(card))}` : 
                                'Not available'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Hotel Savings (Annual):</span>
                            <span className="text-blue-400">
                              {card.spending_breakdown?.hotels_annual ? 
                                `${formatCurrency(card.spending_breakdown.hotels_annual.savings || 0)} × 12 = ${formatCurrency(calculateHotelSavings(card))}` : 
                                'Not available'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Extra Benefits:</span>
                            <span className="text-purple-400">
                              {card.total_extra_benefits !== undefined ? formatCurrency(card.total_extra_benefits) : 'Not available'}
                            </span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-semibold">
                            <span className="text-gray-300">Total Annual Savings:</span>
                            <span className="text-blue-300">
                              {card.total_saving_yearly || card.total_savings_yearly ? formatCurrency(card.total_saving_yearly || card.total_savings_yearly) : 'Not available'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Level 3: Category Analysis */}
                  <div className="bg-blue-900/30 border border-white/10 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-purple-300 flex items-center">
                        <Info className="h-5 w-5 mr-2" />
                        Level 3: Category Analysis
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-500 text-white font-bold rounded-lg shadow hover:from-blue-700 hover:to-purple-600 transition-all duration-150 border-none px-4 py-2"
                        onClick={() => toggleLevel(cardIndex, 'level3')}
                      >
                        {expandedLevels[`${cardIndex}-level3`] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        {expandedLevels[`${cardIndex}-level3`] ? 'Hide Details' : 'View Details'}
                      </Button>
                    </div>

                    {expandedLevels[`${cardIndex}-level3`] && (
                      <div className="space-y-6">
                        {/* Hotel Category Analysis */}
                        <div className="bg-blue-900/30 border border-white/10 rounded-lg p-4">
                          <h5 className="text-gray-300 text-sm mb-4 flex items-center">
                            <Hotel className="h-4 w-4 mr-2" />
                            Hotel Category Analysis
                          </h5>
                          
                          {card.spending_breakdown?.hotels_annual ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-blue-900/30 border border-white/10 rounded p-3">
                                  <h6 className="text-gray-400 text-xs mb-1">Monthly Spend</h6>
                                  <p className="text-blue-400 font-semibold">
                                    {formatCurrency(card.spending_breakdown.hotels_annual.spend || 0)}
                                  </p>
                                </div>
                                
                                <div className="bg-blue-900/30 border border-white/10 rounded p-3">
                                  <h6 className="text-gray-400 text-xs mb-1">Points Earned</h6>
                                  <p className="text-green-400 font-semibold">
                                    {card.spending_breakdown.hotels_annual.points_earned?.toLocaleString() || 0}
                                  </p>
                                </div>
                                
                                <div className="bg-blue-900/30 border border-white/10 rounded p-3">
                                  <h6 className="text-gray-400 text-xs mb-1">Conversion Rate</h6>
                                  <p className="text-purple-400 font-semibold">
                                    {card.spending_breakdown.hotels_annual.conv_rate ? 
                                      `₹${card.spending_breakdown.hotels_annual.conv_rate}` : 
                                      'Not available'
                                    }
                                  </p>
                                </div>
                                
                                <div className="bg-blue-900/30 border border-white/10 rounded p-3">
                                  <h6 className="text-gray-400 text-xs mb-1">Monthly Savings</h6>
                                  <p className="text-yellow-400 font-semibold text-lg">
                                    {formatCurrency(card.spending_breakdown.hotels_annual.savings || 0)}
                                  </p>
                                  <div className="text-xs text-gray-400 mt-2 p-2 bg-blue-900/30 rounded">
                                    <p className="font-medium text-gray-300 mb-1">Calculation:</p>
                                    <p className="text-green-400">{card.spending_breakdown.hotels_annual.points_earned?.toLocaleString() || 0} points</p>
                                    <p className="text-gray-500">×</p>
                                    <p className="text-purple-400">₹{card.spending_breakdown.hotels_annual.conv_rate || 0} per point</p>
                                    <p className="text-gray-500">=</p>
                                    <p className="text-yellow-400 font-medium">{formatCurrency(card.spending_breakdown.hotels_annual.savings || 0)}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-blue-500/20 border border-blue-400/30 rounded p-3">
                                <h6 className="text-blue-300 text-sm mb-1">Annual Hotel Savings</h6>
                                <p className="text-blue-300 font-bold text-lg">
                                  {formatCurrency(calculateHotelSavings(card))}
                                </p>
                                <p className="text-xs text-blue-400">
                                  {formatCurrency(card.spending_breakdown.hotels_annual.savings || 0)} × 12 months
                                </p>
                              </div>
                              
                              {card.spending_breakdown.hotels_annual.explanation && (
                                <div className="bg-blue-900/30 rounded p-3">
                                  <h6 className="text-gray-300 text-sm mb-2">How it works:</h6>
                                  <p className="text-gray-400 text-sm leading-relaxed">
                                    {card.spending_breakdown.hotels_annual.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No hotel data available</p>
                          )}
                        </div>

                        {/* Flight Category Analysis */}
                        <div className="bg-blue-900/30 border border-white/10 rounded-lg p-4">
                          <h5 className="text-gray-300 text-sm mb-4 flex items-center">
                            <Plane className="h-4 w-4 mr-2" />
                            Flight Category Analysis
                          </h5>
                          
                          {card.spending_breakdown?.flights_annual ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-blue-900/30 rounded p-3">
                                  <h6 className="text-gray-400 text-xs mb-1">Monthly Spend</h6>
                                  <p className="text-blue-400 font-semibold">
                                    {formatCurrency(card.spending_breakdown.flights_annual.spend || 0)}
                                  </p>
                                </div>
                                
                                <div className="bg-blue-900/30 rounded p-3">
                                  <h6 className="text-gray-400 text-xs mb-1">Points Earned</h6>
                                  <p className="text-green-400 font-semibold">
                                    {card.spending_breakdown.flights_annual.points_earned?.toLocaleString() || 0}
                                  </p>
                                </div>
                                
                                <div className="bg-blue-900/30 rounded p-3">
                                  <h6 className="text-gray-400 text-xs mb-1">Conversion Rate</h6>
                                  <p className="text-purple-400 font-semibold">
                                    {card.spending_breakdown.flights_annual.conv_rate ? 
                                      `₹${card.spending_breakdown.flights_annual.conv_rate}` : 
                                      'Not available'
                                    }
                                  </p>
                                </div>
                                
                                <div className="bg-blue-900/30 rounded p-3">
                                  <h6 className="text-gray-400 text-xs mb-1">Monthly Savings</h6>
                                  <p className="text-yellow-400 font-semibold text-lg">
                                    {formatCurrency(card.spending_breakdown.flights_annual.savings || 0)}
                                  </p>
                                  <div className="text-xs text-gray-400 mt-2 p-2 bg-blue-900/30 rounded">
                                    <p className="font-medium text-gray-300 mb-1">Calculation:</p>
                                    <p className="text-green-400">{card.spending_breakdown.flights_annual.points_earned?.toLocaleString() || 0} points</p>
                                    <p className="text-gray-500">×</p>
                                    <p className="text-purple-400">₹{card.spending_breakdown.flights_annual.conv_rate || 0} per point</p>
                                    <p className="text-gray-500">=</p>
                                    <p className="text-yellow-400 font-medium">{formatCurrency(card.spending_breakdown.flights_annual.savings || 0)}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-blue-500/20 border border-blue-400/30 rounded p-3">
                                <h6 className="text-blue-300 text-sm mb-1">Annual Flight Savings</h6>
                                <p className="text-blue-300 font-bold text-lg">
                                  {formatCurrency(calculateFlightSavings(card))}
                                </p>
                                <p className="text-xs text-blue-400">
                                  {formatCurrency(card.spending_breakdown.flights_annual.savings || 0)} × 12 months
                                </p>
                              </div>
                              
                              {card.spending_breakdown.flights_annual.explanation && (
                                <div className="bg-blue-900/30 rounded p-3">
                                  <h6 className="text-gray-300 text-sm mb-2">How it works:</h6>
                                  <p className="text-gray-400 text-sm leading-relaxed">
                                    {card.spending_breakdown.flights_annual.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No flight data available</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Redemption Options */}
                  <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-yellow-300 flex items-center">
                        <Gift className="h-5 w-5 mr-2" />
                        Redemption Options
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-500 text-white font-bold rounded-lg shadow hover:from-blue-700 hover:to-purple-600 transition-all duration-150 border-none px-4 py-2"
                        onClick={() => toggleLevel(cardIndex, 'redemption')}
                      >
                        {expandedLevels[`${cardIndex}-redemption`] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        {expandedLevels[`${cardIndex}-redemption`] ? 'Hide Details' : 'View Details'}
                      </Button>
                    </div>

                    {expandedLevels[`${cardIndex}-redemption`] && (
                      <div className="space-y-4">
                        {card.redemption_options && card.redemption_options.length > 0 ? (
                          Object.entries(groupRedemptionOptionsByMethod(card.redemption_options)).map(
                            ([method, options]: [string, any[]], groupIdx: number) => (
                              <div key={groupIdx} className="bg-white/5 rounded-lg p-4">
                                <h5 className="text-yellow-300 font-semibold mb-3">{method}</h5>
                                <div className="overflow-x-auto">
                                  <table className="min-w-[300px] w-full text-left border-separate border-spacing-y-2">
                                    <thead>
                                      <tr>
                                        <th className="text-gray-300 text-sm font-medium">Brand</th>
                                        <th className="text-gray-300 text-sm font-medium">Conversion Rate</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {options.map((option, idx) => (
                                        <tr key={idx} className="bg-white/10 rounded">
                                          <td className="py-2 px-3 text-white font-bold">{option.brand || 'Not specified'}</td>
                                          <td className="py-2 px-3 text-white font-bold">₹{option.conversion_rate || 0} per point</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                {options.some(option => option.description) && (
                                  <div className="mt-3 p-3 bg-yellow-500/10 rounded-lg">
                                    {options.map((option, idx) => option.description && (
                                      <p key={idx} className="text-yellow-300 text-xs mb-1">{option.brand ? `${option.brand}: ` : ''}{option.description}</p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          )
                        ) : (
                          <div className="bg-white/5 rounded-lg p-4">
                            <h5 className="text-yellow-300 font-semibold mb-3">Redemption Options</h5>
                            <p className="text-gray-400 text-sm">Redemption options not available for this card.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Apply Button */}
                  <div className="text-center pt-4">
                    <Button 
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
                      onClick={() => window.open('#', '_blank')}
                    >
                      {card.commission ? `Apply now and earn ₹${card.commission}` : 'Apply Now'}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Summary CTA */}
        <div className="text-center mt-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Choose Your Perfect Card?</h3>
          <p className="text-gray-300 mb-6">
            All calculations are based on your spending patterns. Click "Apply Now" to get started!
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 text-lg mr-4"
          >
            Back to Calculator
          </Button>
          <Button 
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 text-lg"
            onClick={() => window.open('#', '_blank')}
          >
            Apply for Top Card 💰
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardBreakdown; 