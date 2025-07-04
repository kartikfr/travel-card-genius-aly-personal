import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plane, Hotel, Percent, ExternalLink, Filter, Search } from "lucide-react";

interface TravelOffer {
  id: number;
  brand_name: string;
  cashback: string;
  title: string;
  description: string;
  category: string;
  terms_link: string;
  flat_off?: string;
  cashback_percentage?: number;
}

const Offers = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<TravelOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<TravelOffer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCashback, setSelectedCashback] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data - in production this would come from an API
  const mockOffers: TravelOffer[] = [
    {
      id: 1,
      brand_name: "MakeMyTrip",
      cashback: "12%",
      cashback_percentage: 12,
      title: "Flight Bookings",
      description: "Score up to 12% cashback on domestic and international flights - because every rupee saved is a rupee earned for your next adventure! ✈️",
      category: "flights",
      terms_link: "#"
    },
    {
      id: 2,
      brand_name: "Booking.com",
      cashback: "8%",
      cashback_percentage: 8,
      title: "Hotel Reservations",
      description: "Get 8% cashback on hotel bookings worldwide. From budget stays to luxury resorts - we've got your back! 🏨",
      category: "hotels",
      terms_link: "#"
    },
    {
      id: 3,
      brand_name: "Agoda",
      cashback: "10%",
      cashback_percentage: 10,
      title: "Accommodation Deals",
      description: "Save 10% on your next hotel or resort booking. More savings = more travel experiences! 🌴",
      category: "hotels",
      terms_link: "#"
    },
    {
      id: 4,
      brand_name: "Cleartrip",
      cashback: "15%",
      cashback_percentage: 15,
      title: "Travel Packages",
      description: "Special cashback on complete travel packages. Let us handle the planning while you save big! 📦",
      category: "packages",
      terms_link: "#",
      flat_off: "2000"
    },
    {
      id: 5,
      brand_name: "Goibibo",
      cashback: "9%",
      cashback_percentage: 9,
      title: "Flight + Hotel Combos",
      description: "Combo deals with extra cashback on flight + hotel bookings. Double the savings, double the fun! 🎯",
      category: "combo",
      terms_link: "#"
    },
    {
      id: 6,
      brand_name: "Yatra",
      cashback: "7%",
      cashback_percentage: 7,
      title: "Bus & Train Tickets",
      description: "Cashback on bus and train ticket bookings. Every journey counts, every saving matters! 🚆",
      category: "transport",
      terms_link: "#"
    },
    {
      id: 7,
      brand_name: "Expedia",
      cashback: "11%",
      cashback_percentage: 11,
      title: "International Hotels",
      description: "Premium cashback on international hotel bookings. Make your overseas trips more affordable! 🌍",
      category: "hotels",
      terms_link: "#"
    },
    {
      id: 8,
      brand_name: "Trivago",
      cashback: "6%",
      cashback_percentage: 6,
      title: "Hotel Comparisons",
      description: "Find the best hotel deals and earn cashback too. Compare, book, and save! 🔍",
      category: "hotels",
      terms_link: "#",
      flat_off: "1500"
    }
  ];

  useEffect(() => {
    setOffers(mockOffers);
    setFilteredOffers(mockOffers);
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    filterOffers();
  }, [offers, searchTerm, selectedBrand, selectedCashback, selectedCategory]);

  const filterOffers = () => {
    let filtered = offers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(offer => 
        offer.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Brand filter
    if (selectedBrand !== "all") {
      filtered = filtered.filter(offer => 
        offer.brand_name.toLowerCase().includes(selectedBrand.toLowerCase())
      );
    }

    // Cashback percentage filter
    if (selectedCashback !== "all") {
      const range = selectedCashback.split('-');
      const min = parseInt(range[0]);
      const max = range[1] ? parseInt(range[1]) : 100;
      
      filtered = filtered.filter(offer => {
        const cashback = offer.cashback_percentage || 0;
        return cashback >= min && cashback <= max;
      });
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(offer => offer.category === selectedCategory);
    }

    setFilteredOffers(filtered);
  };

  const getBrandOptions = () => {
    const brands = [...new Set(offers.map(offer => offer.brand_name))];
    return brands;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'flights':
      case 'packages':
      case 'combo':
        return <Plane className="h-5 w-5" />;
      case 'hotels':
        return <Hotel className="h-5 w-5" />;
      default:
        return <Percent className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'flights':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'hotels':
        return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      case 'packages':
        return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'combo':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'transport':
        return 'bg-red-500/20 text-red-300 border-red-400/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold border-none"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Exclusive Travel Deals Just for You! 🎉
          </h1>
          <p className="text-xl text-gray-300">
            {filteredOffers.length} Amazing Offers to Make Your Travel Dreams Affordable!
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8 border border-white/20">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Find Your Perfect Deal</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search offers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>

            {/* Brand Filter */}
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {getBrandOptions().map(brand => (
                  <SelectItem key={brand} value={brand.toLowerCase()}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Cashback Filter */}
            <Select value={selectedCashback} onValueChange={setSelectedCashback}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Cashback %" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Cashback</SelectItem>
                <SelectItem value="0-5">0-5%</SelectItem>
                <SelectItem value="6-10">6-10%</SelectItem>
                <SelectItem value="11-15">11-15%</SelectItem>
                <SelectItem value="16-100">16%+</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="flights">Flights</SelectItem>
                <SelectItem value="hotels">Hotels</SelectItem>
                <SelectItem value="packages">Packages</SelectItem>
                <SelectItem value="combo">Combos</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOffers.map((offer) => (
            <Card
              key={offer.id}
              className="bg-white/10 backdrop-blur-lg border-white/20 transition-transform transition-shadow duration-300 transform hover:scale-105 hover:shadow-2xl group overflow-hidden cursor-pointer"
              onClick={() => window.open('https://cashkaro.com/', '_blank')}
            >
              <div className="relative">
                {offer.flat_off && (
                  <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">₹{offer.flat_off} OFF</span>
                )}
                <CardHeader className="relative">
                  {/* Cashback Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg px-3 py-1">
                      {offer.cashback} Cashback 🎁
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(offer.category)}`}>
                      {getCategoryIcon(offer.category)}
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white group-hover:text-blue-300 transition-colors">
                        {offer.brand_name}
                      </CardTitle>
                      <p className="text-blue-300 font-medium">{offer.title}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-8">
                  <p className="text-gray-300 leading-relaxed">
                    {offer.description}
                  </p>

                  <div className="flex items-center justify-between pt-4">
                    <Button
                      variant="link"
                      className="text-blue-400 hover:text-blue-300 p-0 h-auto text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(offer.terms_link, '_blank');
                      }}
                    >
                      Terms & Conditions
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('#', '_blank');
                    }}
                  >
                    Grab This Deal! 🔥
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Offers Found</h3>
            <p className="text-gray-300">Try adjusting your filters to discover more amazing deals!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;