import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Waves } from 'lucide-react';
import { oceanAudio } from '../utils/oceanAudio';

interface AudioPlayerPillProps {
  variant?: 'floating' | 'inline';
  className?: string;
}

export const AudioPlayerPill: React.FC<AudioPlayerPillProps> = ({
  variant = 'floating',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.4);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const toggleSound = () => {
    if (isPlaying) {
      oceanAudio.stop();
      setIsPlaying(false);
    } else {
      const ok = oceanAudio.play();
      if (ok) {
        setIsPlaying(true);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 4000);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    oceanAudio.setVolume(val);
  };

  useEffect(() => {
    return () => {
      oceanAudio.stop();
    };
  }, []);

  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#004F8A]/15 shadow-xs ${className}`}>
        <button
          type="button"
          onClick={toggleSound}
          className="flex items-center gap-2 text-xs font-semibold text-[#004F8A] hover:text-[#4FA8D8] transition-colors cursor-pointer"
          title={isPlaying ? 'Pausar som das ondas' : 'Ouvir som da praia em Saquarema'}
        >
          {isPlaying ? (
            <>
              <div className="flex items-end gap-0.5 h-3.5">
                <span className="w-1 bg-[#4FA8D8] rounded-full animate-[bounce_0.8s_infinite] h-3" />
                <span className="w-1 bg-[#004F8A] rounded-full animate-[bounce_1.1s_infinite_0.2s] h-4" />
                <span className="w-1 bg-[#4FA8D8] rounded-full animate-[bounce_0.9s_infinite_0.4s] h-2.5" />
              </div>
              <span className="font-bold">Ondas Ao Vivo</span>
            </>
          ) : (
            <>
              <Waves className="w-4 h-4 text-[#4FA8D8]" />
              <span>Ouvir Praia</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-20 sm:bottom-6 right-4 z-40 flex flex-col items-end ${className}`}>
      {showTooltip && (
        <div className="mb-2 bg-[#004F8A] text-white text-xs font-medium py-1.5 px-3 rounded-xl shadow-lg border border-white/20 animate-fade-in flex items-center gap-1.5">
          <Waves className="w-3.5 h-3.5 text-[#4FA8D8]" />
          <span>Sinta a brisa e as ondas do mar de Saquarema</span>
        </div>
      )}

      <div className="flex items-center gap-2 bg-[#004F8A] text-white pl-3.5 pr-2.5 py-2 rounded-full shadow-xl border border-white/10 backdrop-blur-md transition-all hover:shadow-2xl">
        <button
          type="button"
          onClick={toggleSound}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer focus:outline-none"
          aria-label={isPlaying ? 'Pausar som das ondas' : 'Tocar som ambiente das praias de Saquarema'}
        >
          {isPlaying ? (
            <div className="flex items-center gap-2">
              <div className="flex items-end gap-0.5 h-3.5">
                <span className="w-1 bg-[#4FA8D8] rounded-full animate-pulse h-3" />
                <span className="w-1 bg-white rounded-full animate-bounce h-4" />
                <span className="w-1 bg-[#4FA8D8] rounded-full animate-pulse h-2.5" />
              </div>
              <span className="text-white font-bold hidden sm:inline">Som das Ondas</span>
              <span className="text-[#4FA8D8] text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-white/10 rounded-md">Ativo</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#FAF5EE]">
              <Waves className="w-4 h-4 text-[#4FA8D8]" />
              <span className="font-bold text-xs sm:text-sm">Viver a Praia</span>
              <span className="text-[10px] bg-white/15 px-1.5 py-0.5 rounded-full text-white/90">Áudio 3D</span>
            </div>
          )}
        </button>

        {isPlaying ? (
          <div className="flex items-center gap-1.5 pl-2 border-l border-white/20">
            <button
              type="button"
              onClick={toggleSound}
              className="text-white/80 hover:text-white p-1"
              title="Silenciar"
            >
              <Volume2 className="w-4 h-4 text-[#4FA8D8]" />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 accent-[#4FA8D8] cursor-pointer bg-white/20 rounded-lg hidden sm:block"
              title="Ajustar volume"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={toggleSound}
            className="w-7 h-7 rounded-full bg-[#4FA8D8] flex items-center justify-center text-[#004F8A] hover:bg-white transition-colors"
            title="Ligar som das ondas"
          >
            <Volume2 className="w-3.5 h-3.5 fill-current" />
          </button>
        )}
      </div>
    </div>
  );
};
