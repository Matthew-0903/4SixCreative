import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  { id: 1, name: 'Basic Info' },
  { id: 2, name: 'Platforms' },
  { id: 3, name: 'Struggles' },
  { id: 4, name: 'Goals' },
];

export default function JoinForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    platforms: '',
    struggles: '',
    goals: '',
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A] font-sans selection:bg-[#f56830]/30 relative overflow-hidden flex flex-col items-center py-12 px-4 sm:px-6">
      
      {/* Soft Brand Color Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#e9bc8b]/40 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-[#d0c3f1]/50 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-[#88b659]/20 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] bg-[#f56830]/15 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center mb-12 text-center mt-8 w-full max-w-3xl">
        <Link to="/" className="absolute left-0 top-0 text-[#4A4A4A] hover:text-[#f56830] transition-colors flex items-center gap-2 text-sm font-medium">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#e9bc8b] bg-white/60 backdrop-blur-sm mb-6 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#f56830] animate-pulse" />
          <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-[#f56830]">Application Form</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-serif tracking-tight mb-4 text-[#1A1A1A]">
          Let's Work <span className="italic text-[#f56830]">Together.</span>
        </h1>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 w-full max-w-3xl mb-12">
        <div className="flex justify-between items-center relative">
          {/* Connecting Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-[#e9bc8b]/30 -z-10" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#f56830] -z-10 transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-3">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isActive 
                      ? 'bg-white text-[#f56830] shadow-[0_4px_20px_rgba(245,104,48,0.2)] border-2 border-[#f56830]' 
                      : isCompleted
                        ? 'bg-[#f56830] text-white border-2 border-[#f56830]'
                        : 'bg-white text-[#e9bc8b] border-2 border-[#e9bc8b]/50'
                  }`}
                >
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : step.id}
                </div>
                <span className={`text-[0.65rem] font-bold tracking-widest uppercase ${isActive ? 'text-[#f56830]' : isCompleted ? 'text-[#1A1A1A]' : 'text-[#4A4A4A]/50'}`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-3xl bg-white/80 backdrop-blur-xl border border-[#e9bc8b]/30 rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#1A1A1A] mb-2 uppercase tracking-wide">Email Address*</label>
                  <p className="text-xs text-[#4A4A4A] mb-4">Where we should send updates and next steps.</p>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="hello@yourbrand.com"
                    className="w-full bg-[#F9F8F6] border border-[#e9bc8b]/50 rounded-xl px-5 py-4 text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#f56830] focus:ring-2 focus:ring-[#f56830]/20 transition-all"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#1A1A1A] mb-2 uppercase tracking-wide">Which platforms are you currently using?*</label>
                  <p className="text-xs text-[#4A4A4A] mb-4">List all the social media platforms you are active on (e.g., Instagram, TikTok, LinkedIn).</p>
                  <input 
                    type="text"
                    name="platforms"
                    value={formData.platforms}
                    onChange={handleChange}
                    placeholder="Instagram, TikTok, YouTube..."
                    className="w-full bg-[#F9F8F6] border border-[#e9bc8b]/50 rounded-xl px-5 py-4 text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#f56830] focus:ring-2 focus:ring-[#f56830]/20 transition-all"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#1A1A1A] mb-2 uppercase tracking-wide">What are your current struggles or frustrations with social media?*</label>
                  <p className="text-xs text-[#4A4A4A] mb-4">Tell us what's not working or where you feel stuck.</p>
                  <textarea 
                    name="struggles"
                    value={formData.struggles}
                    onChange={handleChange}
                    placeholder="I don't have time to edit, my engagement is dropping..."
                    rows={4}
                    className="w-full bg-[#F9F8F6] border border-[#e9bc8b]/50 rounded-xl px-5 py-4 text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#f56830] focus:ring-2 focus:ring-[#f56830]/20 transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#1A1A1A] mb-2 uppercase tracking-wide">What goals do you have for your social media over the next 3–6 months?*</label>
                  <p className="text-xs text-[#4A4A4A] mb-4">More leads, brand awareness, higher engagement, etc.</p>
                  <textarea 
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    placeholder="I want to double my following and get 5 new clients a month..."
                    rows={4}
                    className="w-full bg-[#F9F8F6] border border-[#e9bc8b]/50 rounded-xl px-5 py-4 text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#f56830] focus:ring-2 focus:ring-[#f56830]/20 transition-all resize-none"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-[#e9bc8b]/30">
          <button 
            onClick={handleBack}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-[#4A4A4A] hover:text-[#1A1A1A] hover:bg-[#e9bc8b]/20 border border-[#e9bc8b]/50'}`}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          
          <button 
            onClick={currentStep === steps.length ? () => alert('Form submitted!') : handleNext}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#1A1A1A] text-white text-sm font-bold hover:bg-[#f56830] hover:shadow-[0_8px_24px_rgba(245,104,48,0.3)] hover:-translate-y-0.5 transition-all duration-300"
          >
            {currentStep === steps.length ? 'Submit Application' : 'Next Step'}
            {currentStep !== steps.length && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
