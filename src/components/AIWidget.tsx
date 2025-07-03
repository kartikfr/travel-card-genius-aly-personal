import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const AIWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hey, I'm Aly! Ask me anything about travel credit cards, rewards, or the best deals—I'm here to help you travel smarter! ✈️💳"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Call our edge function to get AI response
      const response = await fetch('https://sxxwrrlvneupflclrkzz.functions.supabase.co/chat-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4eHdycmx2bmV1cGZsY2xya3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzkyMDIsImV4cCI6MjA2NzAxNTIwMn0.SBAKDHf96vZs5-HfOhEK2NVijj0PgUutbX_r-pkCTFc'}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add bot response
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: data.response || "I'm here to help with travel card questions! Could you please rephrase your question?"
      }]);

    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: "Sorry, looks like I'm having trouble connecting right now. Try again in a bit, or ask me about travel cards, cashback, or my favorite recommendations!"
      }]);
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to AI assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-6 shadow-2xl transform transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="h-14 w-14" />
          </Button>
          
          {/* Floating Message */}
          <div className="absolute bottom-16 right-0 bg-white/95 backdrop-blur-sm text-gray-800 px-5 py-3 rounded-lg shadow-xl flex items-center space-x-3 max-w-xs">
            <span className="text-2xl">🧑‍💼</span>
            <span className="text-lg font-bold whitespace-nowrap">Aly is here!</span>
          </div>
        </div>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[90vw]">
          <Card className="bg-white/95 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-8 w-8" />
                  <CardTitle className="text-base">Aly is here to help</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-blue-100">
                Ask me anything about travel cards, rewards, or trips!
              </p>
            </CardHeader>

            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-64 overflow-y-auto p-3 space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                        {message.type === 'user' ? 
                          <User className="h-5 w-5 text-white" /> : 
                          <Bot className="h-5 w-5 text-white" />
                        }
                      </div>
                      <div className={`px-3 py-2 rounded-lg ${message.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-xs">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-gray-100 px-3 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about travel cards..."
                    className="flex-1 text-xs"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-8 w-8 p-0"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
