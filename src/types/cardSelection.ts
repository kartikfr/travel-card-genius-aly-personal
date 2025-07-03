export interface UserPreferences {
  hotels_annual: number[];
  flights_annual: number[];
  domestic_lounge_usage_quarterly: number[];
  international_lounge_usage_quarterly: number[];
}

export interface CardSelectionProps {
  onRecommendations: (preferences: any, cards: any[]) => void;
}

export interface TravelBenefits {
  domestic_lounges_unlocked?: number;
  international_lounges_unlocked?: number;
}

export interface Card {
  card_name?: string;
  name?: string;
  image?: string;
  travel_benefits?: TravelBenefits;
}
