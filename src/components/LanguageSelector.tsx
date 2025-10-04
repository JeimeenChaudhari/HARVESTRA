import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2 text-sidebar-foreground">
        <Globe className="w-4 h-4" />
        Select Your Language
      </label>
      <p className="text-xs text-muted-foreground">നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക</p>
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">🇬🇧 English</SelectItem>
          <SelectItem value="ml">🇮🇳 മലയാളം</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
