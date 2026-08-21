import React, { useState, useEffect } from 'react';
import { User, Camera } from 'lucide-react';

interface SafeAvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showEditOverlay?: boolean;
  onEditClick?: () => void;
  badge?: React.ReactNode;
}

export const SafeAvatar: React.FC<SafeAvatarProps> = ({
  src,
  alt = 'Avatar',
  name = 'Usuário',
  className = '',
  size = 'md',
  showEditOverlay = false,
  onEditClick,
  badge
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  // Generate initials
  const initials = name
    ? name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('')
    : 'U';

  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 text-base',
    lg: 'w-20 h-20 text-lg',
    xl: 'w-24 h-24 text-xl'
  };

  return (
    <div className={`relative inline-block select-none shrink-0 group ${className}`}>
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={`rounded-2xl object-cover shadow-xs border border-white/20 transition-transform ${sizeClasses[size]} ${className}`}
        />
      ) : (
        <div
          className={`rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#1e40af] text-white font-black flex items-center justify-center shadow-xs border border-white/20 ${sizeClasses[size]} ${className}`}
        >
          {initials || <User className="w-1/2 h-1/2" />}
        </div>
      )}

      {showEditOverlay && (
        <button
          type="button"
          onClick={onEditClick}
          className="absolute inset-0 bg-black/40 hover:bg-black/60 backdrop-blur-2xs rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
          title="Alterar Foto de Perfil"
        >
          <Camera className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-bold">Foto</span>
        </button>
      )}

      {badge && <div className="absolute -bottom-1 -right-1">{badge}</div>}
    </div>
  );
};
