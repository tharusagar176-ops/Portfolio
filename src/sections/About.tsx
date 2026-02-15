import { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Download,
  GraduationCap,
  Award,
  Trophy,
  Target,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function About() {
  const { data } = usePortfolio();
  const { personal, about, certifications, achievements } = data;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleDownloadResume = () => {
    if (personal.resumeUrl) {
      // Check if it's a base64 PDF
      if (personal.resumeUrl.startsWith('data:application/pdf')) {
        // Create a download link for base64 PDF
        const link = document.createElement('a');
        link.href = personal.resumeUrl;
        link.download = `${personal.name.replace(/\s+/g, '_')}_Resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Open URL in new tab
        window.open(personal.resumeUrl, '_blank');
      }
    }
  };

  const handleViewResume = () => {
    setShowResumeDialog(true);
  };

  const isBase64PDF = personal.resumeUrl && personal.resumeUrl.startsWith('data:application/pdf');

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 relative overflow-hidden transition-colors duration-300"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 animate-fade-in ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Badge variant="outline" className="mb-4 border-indigo-500/50 text-indigo-600 dark:text-indigo-400 px-4 py-1">
            About Me
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Let Me <span className="text-indigo-600 dark:text-indigo-400">Introduce</span> Myself
          </h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            A passionate Computer Science & Engineering student dedicated to building innovative solutions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Image & Quick Info */}
          <div className={`space-y-6 transition-all duration-700 delay-200 animate-slide-in-left ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* Profile Card */}
            <Card className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 overflow-hidden shadow-lg">
              <div className="relative">
                {/* Cover Image */}
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600" />
                
                {/* Profile Image */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden bg-gray-200 dark:bg-slate-700">
                    <img
                      src={about.image}
                      alt={personal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-20 pb-6 px-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{personal.name}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 mb-4">{personal.title}</p>

                {/* Contact Info */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
                    <MapPin size={18} className="text-indigo-600 dark:text-indigo-400" />
                    <span>{personal.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
                    <Mail size={18} className="text-indigo-600 dark:text-indigo-400" />
                    <a href={`mailto:${personal.email}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {personal.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
                    <Phone size={18} className="text-indigo-600 dark:text-indigo-400" />
                    <span>{personal.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
                    <Globe size={18} className="text-indigo-600 dark:text-indigo-400" />
                    <a href={personal.website} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {personal.website.replace('https://', '')}
                    </a>
                  </div>
                </div>

                {/* Resume Buttons */}
                {personal.resumeUrl && personal.resumeUrl !== '#' && (
                  <div className="space-y-3 mt-6">
                    <Button 
                      onClick={handleViewResume}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Eye size={18} className="mr-2" />
                      View Resume
                    </Button>
                    <Button 
                      onClick={handleDownloadResume}
                      variant="outline"
                      className="w-full border-gray-300 dark:border-slate-600"
                    >
                      <Download size={18} className="mr-2" />
                      Download Resume
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {about.highlights.filter(stat => stat.visible !== false).map((stat, index) => (
                <Card
                  key={stat.label}
                  className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 p-4 text-center hover:border-indigo-500/50 transition-all duration-300 group shadow-md animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Bio & Details */}
          <div className={`space-y-8 transition-all duration-700 delay-400 animate-slide-in-right ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {/* Bio */}
            <div className="prose prose-invert max-w-none">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="text-indigo-600 dark:text-indigo-400" size={24} />
                My Story
              </h3>
              <div className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {about.description}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <GraduationCap className="text-indigo-600 dark:text-indigo-400" size={24} />
                Certifications
              </h3>
              <div className="space-y-3">
                {certifications.filter(cert => cert.visible !== false).map((cert) => (
                  <Card
                    key={cert.name}
                    className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 p-4 flex items-center justify-between hover:border-indigo-500/50 transition-all cursor-pointer group shadow-md animate-fade-in"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                        <Award className="text-indigo-600 dark:text-indigo-400" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {cert.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400">{cert.issuer} • {cert.date}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Trophy className="text-indigo-600 dark:text-indigo-400" size={24} />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.filter(achievement => achievement.visible !== false).map((achievement) => (
                  <Card
                    key={achievement.title}
                    className="bg-gradient-to-r from-white to-gray-50 dark:from-slate-800/50 dark:to-slate-800/30 border-gray-200 dark:border-slate-700 p-4 hover:border-yellow-500/50 transition-all shadow-md animate-fade-in"
                  >
                    <div className="flex items-start gap-3">
                      <Trophy className="text-yellow-500 dark:text-yellow-400 shrink-0 mt-1" size={18} />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400">{achievement.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Viewer Dialog */}
      <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <DialogContent className="max-w-5xl h-[90vh] bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="text-indigo-600 dark:text-indigo-400" size={24} />
                Resume Preview
              </span>
              <Button
                onClick={handleDownloadResume}
                variant="outline"
                size="sm"
                className="border-gray-300 dark:border-slate-600"
              >
                <Download size={16} className="mr-2" />
                Download
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950">
            {isBase64PDF ? (
              <iframe
                src={personal.resumeUrl}
                className="w-full h-full"
                title="Resume Preview"
              />
            ) : (
              <iframe
                src={personal.resumeUrl}
                className="w-full h-full"
                title="Resume Preview"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
