import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const KrishiBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      // Check if environment variables are available
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration missing');
      }

      const CHAT_URL = `${supabaseUrl}/functions/v1/krishi-chatbot`;
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          language
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: t('error'),
            description: "Rate limit exceeded. Please try again later.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        if (response.status === 402) {
          toast({
            title: t('error'),
            description: "AI service payment required.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      if (!reader) throw new Error('No reader available');

      const updateAssistant = (content: string) => {
        assistantContent = content;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant') {
            return prev.map((m, i) => 
              i === prev.length - 1 ? { ...m, content: assistantContent } : m
            );
          }
          return [...prev, { role: 'assistant', content: assistantContent }];
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });
        const lines = textBuffer.split('\n');
        textBuffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            // Clean the line before parsing
            const cleanLine = line.trim();
            
            // Skip lines that don't look like JSON
            if (!cleanLine.startsWith('{') && !cleanLine.startsWith('[')) {
              continue;
            }
            
            // Attempt to fix common JSON issues
            let fixedLine = cleanLine;
            
            // Remove trailing commas before closing braces/brackets
            fixedLine = fixedLine.replace(/,([\s]*[}\]])/g, '$1');
            
            // Parse the cleaned JSON
            const parsed = JSON.parse(fixedLine);
            
            // Handle different response formats
            let content = '';
            
            // Try different paths for the content
            if (parsed.candidates?.[0]?.content?.parts?.[0]?.text) {
              content = parsed.candidates[0].content.parts[0].text;
            } else if (parsed.content) {
              content = typeof parsed.content === 'string' ? parsed.content : '';
            } else if (parsed.text) {
              content = parsed.text;
            } else if (parsed.message) {
              content = parsed.message;
            }
            
            if (content && typeof content === 'string') {
              assistantContent += content;
              updateAssistant(assistantContent);
            }
          } catch (e) {
            // Silently skip malformed JSON lines to avoid console spam
            // This is expected behavior when the API sends partial/malformed responses
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Provide context-aware fallback responses
      const userMessageLower = userMessage.content.toLowerCase();
      let fallbackResponse = '';
      
      if (language === 'ml') {
        if (userMessageLower.includes('വള്ളം') || userMessageLower.includes('വളം')) {
          fallbackResponse = "കൃഷിയിൽ ജൈവ വളം ഉപയോഗിക്കുന്നത് മികച്ച ഫലം നൽകും. കമ്പോസ്റ്റ്, പച്ച വളം, ജീവാമൃതം എന്നിവ പരീക്ഷിച്ചുനോക്കൂ.";
        } else if (userMessageLower.includes('വെള്ളം') || userMessageLower.includes('നനയ്ക്കൽ')) {
          fallbackResponse = "വെള്ളം ലാഭിക്കാൻ ഡ്രിപ്പ് ഇറിഗേഷൻ അല്ലെങ്കിൽ മൾച്ചിംഗ് ഉപയോഗിക്കാം. രാവിലെയും വൈകുന്നേരവും വെള്ളം കൊടുക്കുന്നത് നല്ലതാണ്.";
        } else if (userMessageLower.includes('രോഗം') || userMessageLower.includes('പുഴു')) {
          fallbackResponse = "ജൈവ കീടനാശിനി ഉപയോഗിക്കൂ. നിംബ് ഓയിൽ, സോപ്പ് സ്പ്രേ എന്നിവ സുരക്ഷിതമാണ്. വൃത്തിയുള്ള കൃഷിരീതി പാലിക്കൂ.";
        } else {
          fallbackResponse = "ക്ഷമിക്കണം, ഇപ്പോൾ എനിക്ക് പൂർണ്ണമായി പ്രതികരിക്കാൻ കഴിയുന്നില്ല. സുസ്ഥിര കൃഷിയെക്കുറിച്ച് കൂടുതൽ അറിയാൻ വിദഗ്ധരുടെ സഹായം തേടൂ.";
        }
      } else {
        if (userMessageLower.includes('fertilizer') || userMessageLower.includes('nutrition')) {
          fallbackResponse = "For sustainable farming, try organic fertilizers like compost, green manure, or jeevamrutam. These improve soil health naturally.";
        } else if (userMessageLower.includes('water') || userMessageLower.includes('irrigation')) {
          fallbackResponse = "Water conservation is key! Consider drip irrigation, mulching, and watering during early morning or evening hours for best results.";
        } else if (userMessageLower.includes('pest') || userMessageLower.includes('disease') || userMessageLower.includes('insect')) {
          fallbackResponse = "For natural pest control, try neem oil, soap spray, or beneficial insects. Always maintain good field hygiene.";
        } else if (userMessageLower.includes('crop') || userMessageLower.includes('plant')) {
          fallbackResponse = "Choose crops suitable for your climate and soil. Crop rotation and intercropping can improve yields naturally.";
        } else {
          fallbackResponse = "I'm currently offline but here are some general farming tips: Use organic methods, conserve water, maintain soil health, and seek advice from agricultural experts.";
        }
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponse }]);
      
      toast({
        title: t('error') || 'Error',
        description: "API temporarily unavailable. Showing helpful farming tips.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 h-5" />
              <div>
                <h3 className="font-bold">KrishiBot</h3>
                <p className="text-xs opacity-90">
                  {language === 'ml' ? 'കൃഷി വിദഗ്ധൻ' : 'Farming Expert'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary/90"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  {language === 'ml'
                    ? 'എന്തെങ്കിലും ചോദിക്കൂ...'
                    : 'Ask me anything about sustainable farming...'}
                </p>
              </div>
            )}
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary p-3 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === 'ml'
                    ? 'ഒരു സന്ദേശം ടൈപ്പ് ചെയ്യൂ...'
                    : 'Type a message...'
                }
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export { KrishiBot };
export default KrishiBot;
