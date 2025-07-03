import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      comment: "Thanks to Aly's recommendations, I got the HDFC Infinia Card. Saved ₹50,000+ on my Europe trip with lounge access and no forex fees!",
      image: "/priya-sharma.jpg",
      card: "HDFC Infinia Card"
    },
    {
      name: "Rahul Mehta",
      location: "Delhi",
      rating: 5,
      comment: "The personalized suggestions led me to the Axis Atlas Card. Earned enough points for a free domestic flight within 3 months!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      card: "Axis Atlas Card"
    },
    {
      name: "Sneha Patel",
      location: "Bangalore",
      rating: 5,
      comment: "Got the SBI Elite Card through Aly's platform. Saved 15% on hotel bookings and the AI assistant was incredibly helpful!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      card: "SBI Elite Card"
    },
    {
      name: "Arjun Singh",
      location: "Pune",
      rating: 5,
      comment: "Applied for ICICI Emeralde Card and got approved with ₹10L credit limit! Amazing travel benefits and seamless experience.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      card: "ICICI Emeralde Card"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Hear from Our Happy Travelers! 🛫
          </h2>
          <p className="text-xl text-gray-300">
            Real experiences from travelers who found their perfect cards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl"
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              <CardContent className="p-8">
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="h-8 w-8 text-blue-400 opacity-50" />
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                  "{testimonial.comment}"
                </p>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-400/30">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">
                      {testimonial.name}
                    </p>
                    <p className="text-blue-300 text-sm">
                      {testimonial.location}
                    </p>
                    <p className="text-green-400 text-xs font-medium">
                      Card: {testimonial.card}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-white/5 backdrop-blur-sm rounded-full px-8 py-4 border border-white/10">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-semibold">4.9/5 Rating</span>
            </div>
            <div className="w-px h-6 bg-white/20"></div>
            <div className="text-white font-semibold">50,000+ Happy Customers</div>
            <div className="w-px h-6 bg-white/20"></div>
            <div className="text-white font-semibold">₹10Cr+ Savings Generated</div>
          </div>
        </div>
      </div>
    </section>
  );
};
