import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PreferenceSliders } from "@/components/PreferenceSliders";
import { filterCardsByLoungeRequirements } from "@/utils/cardFiltering";
import { UserPreferences, CardSelectionProps } from "@/types/cardSelection";

export const CardSelection = ({ onRecommendations }: CardSelectionProps) => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>({
    hotels_annual: [50000],
    flights_annual: [75000],
    domestic_lounge_usage_quarterly: [10],
    international_lounge_usage_quarterly: [5]
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSliderChange = (key: string, value: number[]) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    try {
      // Build the payload for the Card Genius API
      const recommendationPayload = {
        hotels_annual: preferences.hotels_annual[0],
        flights_annual: preferences.flights_annual[0],
        domestic_lounge_usage_quarterly: preferences.domestic_lounge_usage_quarterly[0],
        international_lounge_usage_quarterly: preferences.international_lounge_usage_quarterly[0],
        selected_card_id: null
      };

      console.log('🚀 Sending API request with payload:', recommendationPayload);

      const personalizedResponse = await fetch('https://card-recommendation-api-v2.bankkaro.com/cg/api/pro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recommendationPayload)
      });

      if (!personalizedResponse.ok) {
        throw new Error('Failed to fetch personalized recommendations');
      }

      const personalizedData = await personalizedResponse.json();
      console.log('📋 API Response received:', personalizedData);
      
      // Get all cards from API response (they come in priority order: 0, 1, 2, 3, 4...)
      let allCards = personalizedData.savings || [];
      console.log(`📊 Total cards from API (in priority order): ${allCards.length}`);
      
      // Debug: Log first few cards to understand structure
      if (allCards.length > 0) {
        console.log('🔍 Sample card structure:', allCards[0]);
        console.log('🔍 Sample card travel benefits:', allCards[0]?.travel_benefits);
      }

      // Apply frontend filtering based on lounge requirements while maintaining priority order
      const filteredCards = filterCardsByLoungeRequirements(allCards, preferences);
      console.log(`🎯 Cards after lounge filtering: ${filteredCards.length}`);
      
      // Take top 6 cards that meet the criteria (they maintain their priority order)
      const finalCards = filteredCards.slice(0, 6);
      console.log(`🏆 Final cards to display (top 6 that meet criteria): ${finalCards.length}`);

      // Enhanced debugging for final cards
      if (finalCards.length > 0) {
        console.log('✅ FINAL CARDS TO DISPLAY:');
        finalCards.forEach((card, index) => {
          console.log(`${index + 1}. ${card.card_name || card.name}`, {
            domestic_lounges: card.travel_benefits?.domestic_lounges_unlocked || 'N/A',
            international_lounges: card.travel_benefits?.international_lounges_unlocked || 'N/A'
          });
        });
      }

      // Handle different scenarios based on filtered results
      if (finalCards.length === 0) {
        toast({
          title: "No Matching Cards Found! 😔",
          description: "Try adjusting your lounge requirements. Consider lowering your domestic or international lounge visit needs to see more options.",
          variant: "destructive",
        });
        return;
      }

      if (finalCards.length < 6) {
        toast({
          title: `Found ${finalCards.length} Matching Cards! 🎯`,
          description: `Only ${finalCards.length} cards meet your specific lounge requirements. Try adjusting your settings for more options.`,
        });
      } else {
        toast({
          title: "Perfect Match! 💥",
          description: `Found ${finalCards.length} travel cards that perfectly match your lounge needs!`,
        });
      }

      // Pass the filtered cards to display
      onRecommendations(preferences, finalCards);

    } catch (error) {
      console.error('❌ Error fetching recommendations:', error);
      toast({
        title: "Oops! 😅",
        description: "Something went wrong. Don't worry, let's try again!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="card-selection" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Quick Travel Style Check! ✈️
          </h2>
          <p className="text-lg text-gray-300">
            Just slide to tell us about your travel habits (takes 30 seconds!) 
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-center text-white">
              Customize Your Travel Profile 🎯
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <PreferenceSliders 
              preferences={preferences}
              onSliderChange={handleSliderChange}
            />

            <div className="pt-4 text-center">
              <Button 
                onClick={handleGetRecommendations}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg transform transition-all duration-300 hover:scale-105"
              >
                {isLoading ? 'Finding Your Perfect Cards... 🔍' : 'Get My Dream Cards! 🚀'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
