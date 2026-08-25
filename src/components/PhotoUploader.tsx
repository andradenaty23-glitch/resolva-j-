import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Check, Sparkles, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { SafeAvatar } from './SafeAvatar';

interface PhotoUploaderProps {
  currentPhoto?: string;
  userName?: string;
  role?: 'cliente' | 'prestador';
  onPhotoSelected: (photoUrl: string) => void;
  title?: string;
  subtitle?: string;
}

const PRESET_AVATARS_CLIENT = [
  { label: 'Foto 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' },
  { label: 'Foto 2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80' },
  { label: 'Foto 3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80' },
  { label: 'Foto 4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80' }
];

const PRESET_AVATARS_PROVIDER = [
  { label: 'Técnico 1', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80' },
  { label: 'Técnica 2', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80' },
  { label: 'Técnico 3', url: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=256&q=80' },
  { label: 'Técnico 4', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80' }
];

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  currentPhoto = '',
  userName = 'Usuário',
  role = 'cliente',
  onPhotoSelected,
  title = 'Foto de Perfil',
  subtitle = 'Adicione sua foto para identificação segura no Resolva Já'
}) => {
  const [photo, setPhoto] = useState<string>(currentPhoto);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = role === 'prestador' ? PRESET_AVATARS_PROVIDER : PRESET_AVATARS_CLIENT;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecione um arquivo de imagem válido (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPhoto(result);
        onPhotoSelected(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPhoto(result);
        onPhotoSelected(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!inputUrl.trim()) return;
    setPhoto(inputUrl.trim());
    onPhotoSelected(inputUrl.trim());
    setIsUrlMode(false);
    setInputUrl('');
  };

  const handleSelectPreset = (url: string) => {
    setPhoto(url);
    onPhotoSelected(url);
  };

  const handleRemovePhoto = () => {
    setPhoto('');
    onPhotoSelected('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-[#fafafa] rounded-2xl p-4 border border-[#e4e4e7] flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#18181b] flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-[#ea580c]" />
          <span>{title}</span>
        </label>
        <span className="text-[10px] text-[#71717a] font-medium">{subtitle}</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Avatar Display with Active Frame */}
        <div className="relative group">
          <SafeAvatar
            src={photo}
            name={userName}
            size="lg"
            className="w-20 h-20 rounded-2xl border-2 border-[#ea580c] shadow-sm"
          />
          {photo && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute -top-2 -right-2 p-1 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
              title="Remover Foto"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex-1 w-full flex flex-col gap-2">
          {/* File Upload Trigger */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
              isDragging
                ? 'border-[#ea580c] bg-[#fff7ed]'
                : 'border-[#e4e4e7] hover:border-[#ea580c] bg-white hover:bg-[#fff7ed]/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#ea580c]">
              <Upload className="w-3.5 h-3.5" />
              <span>{photo ? 'Trocar Foto do Dispositivo / Câmera' : 'Carregar Foto do Dispositivo / Câmera'}</span>
            </div>
            <p className="text-[10px] text-[#71717a]">Arraste ou clique para selecionar foto JPG, PNG</p>
          </div>

          {/* Quick Preset Avatars or URL Mode */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              <span className="text-[10px] font-bold text-[#52525b] whitespace-nowrap">Sugestões:</span>
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`w-7 h-7 rounded-lg overflow-hidden border transition-all cursor-pointer shrink-0 ${
                    photo === preset.url ? 'border-2 border-[#ea580c] scale-105 shadow-xs' : 'border-zinc-200 opacity-80 hover:opacity-100'
                  }`}
                  title={`Escolher ${preset.label}`}
                >
                  <img loading="lazy" decoding="async" src={preset.url} alt={preset.label} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsUrlMode(!isUrlMode)}
              className="text-[10px] font-bold text-[#ea580c] hover:underline flex items-center gap-0.5 whitespace-nowrap ml-2 cursor-pointer"
            >
              <LinkIcon className="w-3 h-3" />
              {isUrlMode ? 'Ocultar Link' : 'Colar Link'}
            </button>
          </div>

          {/* URL Input */}
          {isUrlMode && (
            <div className="flex items-center gap-2 mt-1 animate-fadeIn">
              <input
                type="url"
                placeholder="https://exemplo.com/sua-foto.jpg"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="flex-1 p-2 text-xs rounded-xl border border-[#e4e4e7] focus:border-[#ea580c] focus:outline-hidden bg-white"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-2 bg-[#ea580c] text-white rounded-xl text-xs font-bold hover:bg-[#c2410c] cursor-pointer"
              >
                Usar Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
