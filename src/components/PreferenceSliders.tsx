import { Slider } from "@/components/ui/slider";
import { Plane, Hotel, Coffee, AlertTriangle } from "lucide-react";
import { UserPreferences } from "@/types/cardSelection";
import { Input } from "@/components/ui/input";

interface PreferenceSlidersProps {
  preferences: UserPreferences;
  onSliderChange: (key: string, value: number[]) => void;
}

export const PreferenceSliders = ({ preferences, onSliderChange }: PreferenceSlidersProps) => {
  // Check if lounge requirements exceed 10
  const domesticWarning = preferences.domestic_lounge_usage_quarterly[0] >= 10;
  const internationalWarning = preferences.international_lounge_usage_quarterly[0] >= 10;

  return (
    <div className="space-y-6">
      {/* Hotels Annual Spend */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Hotel className="h-5 w-5 text-blue-400" />
          <label className="font-medium">How much do you spend on hotels yearly?</label>
        </div>
        <div className="flex items-center space-x-4 px-2">
          <Slider
            value={preferences.hotels_annual}
            onValueChange={(value) => onSliderChange('hotels_annual', value)}
            max={500000}
            min={0}
            step={5000}
            className="w-full"
          />
          <Input
            type="number"
            min={0}
            step={5000}
            className="w-32 text-right bg-white/10 border-white/20 text-blue-400 font-bold"
            value={preferences.hotels_annual[0]}
            onChange={e => {
              let val = parseInt(e.target.value) || 0;
              if (val < 0) val = 0;
              onSliderChange('hotels_annual', [val]);
            }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-300 mt-1">
          <span>₹0</span>
          <span className="font-bold text-blue-400">₹{preferences.hotels_annual[0].toLocaleString()}</span>
          <span>₹5L</span>
        </div>
      </div>

      {/* Flights Annual Spend */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Plane className="h-5 w-5 text-purple-400" />
          <label className="font-medium">Annual flight bookings budget?</label>
        </div>
        <div className="flex items-center space-x-4 px-2">
          <Slider
            value={preferences.flights_annual}
            onValueChange={(value) => onSliderChange('flights_annual', value)}
            max={500000}
            min={0}
            step={5000}
            className="w-full"
          />
          <Input
            type="number"
            min={0}
            step={5000}
            className="w-32 text-right bg-white/10 border-white/20 text-purple-400 font-bold"
            value={preferences.flights_annual[0]}
            onChange={e => {
              let val = parseInt(e.target.value) || 0;
              if (val < 0) val = 0;
              onSliderChange('flights_annual', [val]);
            }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-300 mt-1">
          <span>₹0</span>
          <span className="font-bold text-purple-400">₹{preferences.flights_annual[0].toLocaleString()}</span>
          <span>₹5L</span>
        </div>
      </div>

      {/* Compact Lounge Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Domestic Lounge */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Coffee className="h-4 w-4 text-green-400" />
            <label className="text-sm font-medium">Domestic Lounge Visits Annually</label>
          </div>
          <div className="flex items-center space-x-4">
            <Slider
              value={preferences.domestic_lounge_usage_quarterly}
              onValueChange={(value) => onSliderChange('domestic_lounge_usage_quarterly', value)}
              max={30}
              min={0}
              step={1}
              className="w-full"
            />
            <Input
              type="number"
              min={0}
              max={30}
              step={1}
              className="w-20 text-right bg-white/10 border-white/20 text-green-400 font-bold"
              value={preferences.domestic_lounge_usage_quarterly[0]}
              onChange={e => {
                let val = parseInt(e.target.value) || 0;
                if (val < 0) val = 0;
                if (val > 30) val = 30;
                onSliderChange('domestic_lounge_usage_quarterly', [val]);
              }}
            />
          </div>
          <div className="text-center">
            <span className="font-bold text-green-400 text-sm">{preferences.domestic_lounge_usage_quarterly[0]} visits</span>
          </div>
          {/* Warning Message */}
          {domesticWarning && (
            <div className="flex items-center space-x-2 bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-2 mt-2 animate-pulse">
              <AlertTriangle className="h-3 w-3 text-yellow-400 flex-shrink-0" />
              <span className="text-yellow-300 text-xs">
                Very few cards offer more than 10 domestic lounges annually
              </span>
            </div>
          )}
        </div>

        {/* International Lounge */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Coffee className="h-4 w-4 text-yellow-400" />
            <label className="text-sm font-medium">International Lounge Visits Annually</label>
          </div>
          <div className="flex items-center space-x-4">
            <Slider
              value={preferences.international_lounge_usage_quarterly}
              onValueChange={(value) => onSliderChange('international_lounge_usage_quarterly', value)}
              max={30}
              min={0}
              step={1}
              className="w-full"
            />
            <Input
              type="number"
              min={0}
              max={30}
              step={1}
              className="w-20 text-right bg-white/10 border-white/20 text-yellow-400 font-bold"
              value={preferences.international_lounge_usage_quarterly[0]}
              onChange={e => {
                let val = parseInt(e.target.value) || 0;
                if (val < 0) val = 0;
                if (val > 30) val = 30;
                onSliderChange('international_lounge_usage_quarterly', [val]);
              }}
            />
          </div>
          <div className="text-center">
            <span className="font-bold text-yellow-400 text-sm">{preferences.international_lounge_usage_quarterly[0]} visits</span>
          </div>
          {/* Warning Message */}
          {internationalWarning && (
            <div className="flex items-center space-x-2 bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-2 mt-2 animate-pulse">
              <AlertTriangle className="h-3 w-3 text-yellow-400 flex-shrink-0" />
              <span className="text-yellow-300 text-xs">
                Very few cards offer more than 10 international lounges annually
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
