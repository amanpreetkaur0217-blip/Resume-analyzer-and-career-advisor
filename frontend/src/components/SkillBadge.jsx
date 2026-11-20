import React from 'react';
import { Check, X, Star, Sparkles } from 'lucide-react';

export default function SkillBadge({ name, variant = 'default', size = 'md' }) {
  const styles = {
    matched: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100',
    missing: 'bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-100',
    preferred: 'bg-sky-50 text-sky-700 border-sky-200/80 hover:bg-sky-100',
    soft: 'bg-purple-50 text-purple-700 border-purple-200/80 hover:bg-purple-100',
    default: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs sm:text-sm px-3 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-colors ${
        styles[variant] || styles.default
      } ${sizes[size] || sizes.md}`}
    >
      {variant === 'matched' && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />}
      {variant === 'missing' && <X className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />}
      {variant === 'preferred' && <Star className="w-3.5 h-3.5 text-sky-600 fill-sky-500/20" />}
      {variant === 'soft' && <Sparkles className="w-3.5 h-3.5 text-purple-600" />}
      <span>{name}</span>
    </span>
  );
}
