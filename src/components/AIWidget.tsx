import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, Bot, User, Sparkles, Maximize2, Minimize2 } from "lucide-react";
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
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Pre-suggestive questions
  const suggestedQuestions = [
    "What's the best travel credit card for beginners?",
    "How do I maximize cashback on travel expenses?",
    "Which card offers the best airport lounge access?",
    "What are the hidden fees I should watch out for?",
    "Can you recommend cards for international travel?"
  ];

  // Generate context-aware follow-up questions based on the last bot message
  const generateFollowUpQuestions = (lastBotMessage: string) => {
    const message = lastBotMessage.toLowerCase();
    
    // Card-specific follow-ups
    if (message.includes('card') && (message.includes('recommend') || message.includes('suggest'))) {
      return [
        "What are the annual fees for this card?",
        "How do I apply for this card?",
        "What's the credit score requirement?",
        "Can you compare it with other similar cards?"
      ];
    }
    
    // Fee-related follow-ups
    if (message.includes('fee') || message.includes('cost') || message.includes('charge')) {
      return [
        "Are there ways to waive the annual fee?",
        "What are the foreign transaction fees?",
        "Are there any hidden charges I should know?",
        "How do the fees compare to other cards?"
      ];
    }
    
    // Lounge access follow-ups
    if (message.includes('lounge') || message.includes('airport')) {
      return [
        "Which airports have these lounges?",
        "Can I bring guests to the lounge?",
        "How many lounge visits are included?",
        "What amenities are available in the lounges?"
      ];
    }
    
    // Rewards/cashback follow-ups
    if (message.includes('reward') || message.includes('cashback') || message.includes('point') || message.includes('earn')) {
      return [
        "How do I redeem these rewards?",
        "What's the reward rate on different categories?",
        "Do rewards expire?",
        "Can I transfer points to other programs?"
      ];
    }
    
    // Travel insurance follow-ups
    if (message.includes('insurance') || message.includes('protection')) {
      return [
        "What does the travel insurance cover?",
        "How do I file a claim?",
        "Is there medical coverage included?",
        "What's the coverage limit?"
      ];
    }
    
    // General travel card follow-ups
    if (message.includes('travel')) {
      return [
        "What's the best way to use this card abroad?",
        "Are there any travel-specific benefits?",
        "How do I maximize travel rewards?",
        "What should I know before traveling?"
      ];
    }
    
    // Default follow-ups for general questions
    return [
      "Can you recommend the best card for my spending?",
      "What should I consider before applying?",
      "How do I maximize the benefits?",
      "Are there any alternatives I should know?"
    ];
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setShowSuggestions(false);
    
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

  const handleSuggestionClick = (question: string) => {
    setInputMessage(question);
    setShowSuggestions(false);
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const formatResponse = (content: string) => {
    // Split content into paragraphs and format
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();
      
      // Check if it's a list item
      if (trimmedParagraph.startsWith('•') || trimmedParagraph.startsWith('-')) {
        return (
          <div key={index} className="flex items-start space-x-2 mb-2">
            <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
            <span className="flex-1 leading-relaxed">{trimmedParagraph.replace(/^[•-]\s*/, '')}</span>
          </div>
        );
      }
      
      // Check if it's a heading with colon
      if (trimmedParagraph.includes(':') && trimmedParagraph.length < 50) {
        const [heading, ...rest] = trimmedParagraph.split(':');
        return (
          <div key={index} className="mb-3">
            <div className="font-semibold text-blue-600 mb-1 text-sm">{heading}:</div>
            <div className="leading-relaxed">{rest.join(':')}</div>
          </div>
        );
      }
      
      // Check if it's a numbered list
      if (/^\d+\./.test(trimmedParagraph)) {
        return (
          <div key={index} className="flex items-start space-x-2 mb-2">
            <span className="text-blue-500 mt-1 flex-shrink-0 text-xs">1.</span>
            <span className="flex-1 leading-relaxed">{trimmedParagraph.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }
      
      return <p key={index} className="mb-2 leading-relaxed">{trimmedParagraph}</p>;
    });
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
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out ${
          isExpanded 
            ? 'w-96 h-[500px] sm:w-[450px] sm:h-[600px]' 
            : 'w-80 h-[400px] sm:w-80 sm:h-[450px]'
        } max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)]`}>
          <Card className="bg-white/95 backdrop-blur-lg border-white/20 shadow-2xl h-full flex flex-col">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-6 w-6 sm:h-8 sm:w-8" />
                  <CardTitle className="text-sm sm:text-base">Aly is here to help</CardTitle>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExpandToggle}
                    className="text-white hover:bg-white/20 h-6 w-6 p-0"
                    title={isExpanded ? "Minimize chat" : "Expand chat"}
                  >
                    {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-blue-100">
                Ask me anything about travel cards, rewards, or trips!
              </p>
            </CardHeader>

            <CardContent className="p-0 flex-1 flex flex-col min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                        {message.type === 'user' ? 
                          <User className="h-4 w-4 text-white" /> : 
                          <Bot className="h-4 w-4 text-white" />
                        }
                      </div>
                      <div className={`px-3 py-2 rounded-lg break-words ${message.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                        {message.type === 'bot' ? (
                          <div className={`leading-relaxed ${
                            isExpanded ? 'text-sm' : 'text-xs'
                          }`}>
                            {formatResponse(message.content)}
                          </div>
                        ) : (
                          <p className={`${isExpanded ? 'text-sm' : 'text-xs'} break-words`}>{message.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
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

                {/* Suggested Questions */}
                {showSuggestions && messages.length === 1 && (
                  <div className="space-y-3">
                    <div className="text-xs text-gray-500 font-medium flex items-center space-x-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Popular questions:</span>
                    </div>
                    <div className="space-y-2">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(question)}
                          className={`w-full text-left p-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-lg text-gray-700 transition-all duration-200 border border-blue-200/50 hover:border-blue-300/70 shadow-sm hover:shadow-md ${
                            isExpanded ? 'text-sm' : 'text-xs'
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            <span className="text-blue-500 font-medium text-xs mt-0.5">💡</span>
                            <span className="leading-relaxed">{question}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up Suggestions */}
                {!showSuggestions && !isLoading && messages.length > 1 && (
                  <div className="space-y-3">
                    <div className="text-xs text-gray-500 font-medium flex items-center space-x-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Related questions:</span>
                    </div>
                    <div className="space-y-2">
                      {(() => {
                        const lastBotMessage = messages.filter(m => m.type === 'bot').pop()?.content || '';
                        const followUpQuestions = generateFollowUpQuestions(lastBotMessage);
                        
                        return followUpQuestions.slice(0, 4).map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(question)}
                            className={`w-full text-left p-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-lg text-gray-700 transition-all duration-200 border border-blue-200/50 hover:border-blue-300/70 shadow-sm hover:shadow-md ${
                              isExpanded ? 'text-sm' : 'text-xs'
                            }`}
                          >
                            <div className="flex items-start space-x-2">
                              <span className="text-blue-500 font-medium text-xs mt-0.5">→</span>
                              <span className="leading-relaxed">{question}</span>
                            </div>
                          </button>
                        ));
                      })()}
                    </div>
                  </div>
                )}
                
                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t flex-shrink-0">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about travel cards..."
                    className={`flex-1 ${isExpanded ? 'text-sm' : 'text-xs'}`}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-8 w-8 p-0 flex-shrink-0"
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
