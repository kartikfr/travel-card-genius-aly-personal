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
