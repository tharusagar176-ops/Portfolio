import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Code2, 
  BookOpen, 
  Facebook, 
  Youtube, 
  Instagram, 
  MessageCircle,
  Hash,
  Send,
  Phone,
  Palette,
  Dribbble,
  Eye, 
  EyeOff 
} from 'lucide-react';

export function SocialEditor() {
  const { data, updateSocial } = usePortfolio();
  const [formData, setFormData] = useState(data.social);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: { ...prev[field], url: value } }));
  };

  const handleVisibilityChange = (field: keyof typeof formData, visible: boolean) => {
    setFormData(prev => ({ ...prev, [field]: { ...prev[field], visible } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocial(formData);
  };

  const socialLinks = [
    { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/username', color: 'hover:text-gray-300' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username', color: 'hover:text-blue-400' },
    { key: 'twitter', label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/username', color: 'hover:text-sky-400' },
    { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/username', color: 'hover:text-blue-500' },
    { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@username', color: 'hover:text-red-500' },
    { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username', color: 'hover:text-pink-500' },
    { key: 'medium', label: 'Medium', icon: BookOpen, placeholder: 'https://medium.com/@username', color: 'hover:text-green-500' },
    { key: 'devto', label: 'Dev.to', icon: BookOpen, placeholder: 'https://dev.to/username', color: 'hover:text-black' },
    { key: 'leetcode', label: 'LeetCode', icon: Code2, placeholder: 'https://leetcode.com/username', color: 'hover:text-yellow-400' },
    { key: 'stackoverflow', label: 'Stack Overflow', icon: Hash, placeholder: 'https://stackoverflow.com/users/...', color: 'hover:text-orange-500' },
    { key: 'discord', label: 'Discord', icon: MessageCircle, placeholder: 'https://discord.gg/...', color: 'hover:text-indigo-500' },
    { key: 'telegram', label: 'Telegram', icon: Send, placeholder: 'https://t.me/username', color: 'hover:text-sky-500' },
    { key: 'whatsapp', label: 'WhatsApp', icon: Phone, placeholder: 'https://wa.me/1234567890', color: 'hover:text-green-500' },
    { key: 'reddit', label: 'Reddit', icon: MessageCircle, placeholder: 'https://reddit.com/user/username', color: 'hover:text-orange-600' },
    { key: 'behance', label: 'Behance', icon: Palette, placeholder: 'https://behance.net/username', color: 'hover:text-blue-600' },
    { key: 'dribbble', label: 'Dribbble', icon: Dribbble, placeholder: 'https://dribbble.com/username', color: 'hover:text-pink-600' },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Social Links</h2>
        <p className="text-slate-400">Connect your social media profiles and control their visibility</p>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Social Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {socialLinks.map(({ key, label, icon: Icon, placeholder }) => (
                <div key={key} className="space-y-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={key} className="text-slate-300 flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {label}
                    </Label>
                    <div className="flex items-center gap-2">
                      {formData[key].visible ? (
                        <Eye className="w-4 h-4 text-green-400" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-slate-500" />
                      )}
                      <Switch
                        checked={formData[key].visible}
                        onCheckedChange={(checked) => handleVisibilityChange(key, checked)}
                      />
                      <span className="text-xs text-slate-400">
                        {formData[key].visible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  <Input
                    id={key}
                    type="url"
                    value={formData[key].url}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                    className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  {!formData[key].visible && formData[key].url && (
                    <Badge variant="secondary" className="bg-slate-700 text-slate-400 text-xs">
                      Hidden on Portfolio
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Preview (Visible Links Only)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {socialLinks.map(({ key, icon: Icon, label }) => (
              formData[key].url && formData[key].visible && (
                <a
                  key={key}
                  href={formData[key].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 transition-all"
                  title={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            ))}
          </div>
          {socialLinks.every(({ key }) => !formData[key].visible || !formData[key].url) && (
            <p className="text-slate-500 text-sm">No visible social links</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
