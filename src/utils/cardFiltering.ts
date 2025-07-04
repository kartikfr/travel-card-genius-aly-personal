import { UserPreferences, Card } from "@/types/cardSelection";

export const filterCardsByLoungeRequirements = (cards: Card[], userPreferences: UserPreferences): Card[] => {
  const requiredDomesticLounges = userPreferences.domestic_lounge_usage_quarterly[0];
  const requiredInternationalLounges = userPreferences.international_lounge_usage_quarterly[0];

  const result: Card[] = [];
  for (let i = 0; i < cards.length; i++) {
    if (result.length >= 6) break;
    const card = cards[i];
    const cardName = card.card_name || card.name;
    if (!cardName) continue;
    if (!card.image || typeof card.image !== 'string' || card.image.trim() === '') continue;
    const travelBenefits = card.travel_benefits;
    if (!travelBenefits) continue;
    const hasDomestic = travelBenefits.domestic_lounges_unlocked !== undefined && travelBenefits.domestic_lounges_unlocked !== null;
    const hasInternational = travelBenefits.international_lounges_unlocked !== undefined && travelBenefits.international_lounges_unlocked !== null;
    if (!hasDomestic || !hasInternational) continue;
    const domestic = Number(travelBenefits.domestic_lounges_unlocked) || 0;
    const international = Number(travelBenefits.international_lounges_unlocked) || 0;
    if (domestic >= requiredDomesticLounges && international >= requiredInternationalLounges) {
      result.push(card);
    }
  }
  return result;
};

export const fetchCommissionData = async (cardGeniusCards: any[]) => {
  try {
    console.log('🔄 Fetching commission data from BankKaro API...');
    
    const response = await fetch('https://bk-api.bankkaro.com/sp/api/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug: "",
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

    if (!response.ok) {
      throw new Error('Failed to fetch commission data');
    }

    const data = await response.json();
    const bankKaroCards = data.data?.cards || [];
    
    console.log(`📊 BankKaro API returned ${bankKaroCards.length} cards`);
    
    // Create a map of seo_card_alias to commission data
    const commissionMap = new Map();
    bankKaroCards.forEach((card: any) => {
      if (card.seo_card_alias) {
        commissionMap.set(card.seo_card_alias, {
          commission: card.commission,
          commission_type: card.commission_type,
          image: card.image,
          card_type: card.card_type
        });
      }
    });

    console.log(`🗺️ Created commission map with ${commissionMap.size} entries`);

    // Enhance Card Genius cards with commission data
    const enhancedCards = cardGeniusCards.map(card => {
      const commissionData = commissionMap.get(card.seo_card_alias);
      if (commissionData) {
        console.log(`✅ Mapped commission for ${card.card_name || card.name}:`, commissionData);
        return {
          ...card,
          commission: commissionData.commission,
          commission_type: commissionData.commission_type,
          // Use BankKaro image if Card Genius doesn't have one
          image: card.image || commissionData.image,
          card_type: card.card_type || commissionData.card_type
        };
      } else {
        console.log(`❌ No commission data found for ${card.card_name || card.name} (alias: ${card.seo_card_alias})`);
        return card;
      }
    });

    console.log(`🎯 Enhanced ${enhancedCards.length} cards with commission data`);
    return enhancedCards;

  } catch (error) {
    console.error('❌ Error fetching commission data:', error);
    // Return original cards if commission fetch fails
    return cardGeniusCards;
  }
};
