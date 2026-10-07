import React from 'react';
import { Landmark, ShieldCheck, Coins, Wallet, Gem } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  lightText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSlogan = false,
  lightText = false,
}) => {
  const { brand } = useApp();

  const getIcon = () => {
    const iconProps = { className: 'w-full h-full text-white' };
    switch (brand.logoIcon) {
      case 'shield-check':
        return <ShieldCheck {...iconProps} />;
      case 'coins':
        return <Coins {...iconProps} />;
      case 'wallet':
        return <Wallet {...iconProps} />;
      case 'gem':
        return <Gem {...iconProps} />;
      case 'landmark':
      default:
        return <Landmark {...iconProps} />;
    }
  };

  const sizeClasses = {
    sm: { box: 'w-8 h-8 rounded-lg', text: 'text-sm font-bold', sub: 'text-[10px]' },
    md: { box: 'w-10 h-10 rounded-xl', text: 'text-base font-bold', sub: 'text-xs' },
    lg: { box: 'w-12 h-12 rounded-xl', text: 'text-xl font-black', sub: 'text-xs' },
    xl: { box: 'w-16 h-16 rounded-2xl', text: 'text-2xl font-black', sub: 'text-sm' },
  }[size];

  return (
    <div className="flex items-center gap-3">
      {brand.logoUrl ? (
        <div
          className={`${sizeClasses.box} overflow-hidden flex items-center justify-center border border-white/20 shadow-sm bg-white shrink-0`}
        >
          <img
            src={brand.logoUrl}
            alt={brand.companyName}
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              // fallback if invalid image URL
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div
          className={`${sizeClasses.box} flex items-center justify-center shadow-md shrink-0 p-2 text-white transition-all`}
          style={{ backgroundColor: brand.primaryColor }}
        >
          {getIcon()}
        </div>
      )}

      <div className="flex flex-col min-w-0">
        <span
          className={`tracking-tight truncate leading-tight ${sizeClasses.text} ${
            lightText ? 'text-white' : 'text-slate-900'
          }`}
        >
          {brand.companyName}
        </span>
        {showSlogan && brand.slogan && (
          <span
            className={`truncate ${sizeClasses.sub} ${
              lightText ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            {brand.slogan}
          </span>
        )}
      </div>
    </div>
  );
};
