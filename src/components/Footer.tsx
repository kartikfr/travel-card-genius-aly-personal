
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Mail, Phone, MapPin, Heart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const Footer = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: contactForm.name,
            email: contactForm.email,
            message: contactForm.message
          }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you soon!",
      });
      
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-slate-900/50 backdrop-blur-lg border-t border-white/10 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Branding & Info */}
          <div className="space-y-8">
            {/* Branding */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">AH</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Aly Hajiani</h3>
                  <p className="text-blue-300">Travel Credit Card Expert</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed">
                Helping travelers find the perfect credit cards and maximize their savings. 
                Get personalized recommendations and exclusive deals curated just for you.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-blue-300">Happy Travelers</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-white">₹10Cr+</div>
                <div className="text-blue-300">Savings Generated</div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Connect with Aly</h4>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-pink-400/30 text-pink-300 hover:bg-pink-400/10"
                  onClick={() => window.open('https://www.instagram.com/thatcreditcardguy/', '_blank')}
                >
                  <Instagram className="h-4 w-4 mr-2" />
                  @thatcreditcardguy
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span>support@alyhajiani.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-green-400" />
                  <span>+91 9876543210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-red-400" />
                  <span>Mumbai, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-8">
                <h4 className="text-2xl font-bold text-white mb-6">
                  Have Questions? Let's Chat!
                </h4>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>
                  
                  <div>
                    <Textarea
                      placeholder="Your Message or Questions about Travel Cards..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 min-h-[120px]"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
                
                <p className="text-xs text-gray-400 mt-4 text-center">
                  We typically respond within 24 hours
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            {/* Copyright and Affiliate Disclosure */}
            <div className="flex-1 lg:max-w-2xl">
              <div className="text-gray-400 text-sm leading-relaxed">
                © 2025 Aly Hajiani. All rights reserved. Powered by CashKaro.
              </div>
              <div className="text-gray-400 text-sm leading-relaxed mt-1">
                Affiliate Disclosure: We may earn commission from qualifying purchases made through our links. This doesn't affect your costs.
              </div>
            </div>
            
            {/* Made with love */}
            <div className="flex items-center space-x-1 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400 fill-red-400" />
              <span>for travelers</span>
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 lg:gap-6 text-sm text-gray-400">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
              <button className="hover:text-white transition-colors">Disclaimer</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
