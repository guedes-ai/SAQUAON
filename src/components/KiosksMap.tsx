import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { KioskMerchant } from '../types';
import { FALLBACK_IMAGE } from '../lib/placeholders';
import { Star, MapPin, Store } from 'lucide-react';

interface KiosksMapProps {
  kiosks: KioskMerchant[];
  apiKey: string;
}

export const KiosksMap: React.FC<KiosksMapProps> = ({ kiosks, apiKey }) => {
  const [selectedKiosk, setSelectedKiosk] = useState<KioskMerchant | null>(null);

  // Approximate center for Saquarema beaches
  const saquaremaCenter = { lat: -22.9265, lng: -42.5020 };

  if (!apiKey) {
    return (
      <div className="w-full h-[500px] rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 text-center">
        <MapPin className="w-12 h-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-bold text-slate-700 mb-2">Mapa Indisponível</h3>
        <p className="text-slate-500 max-w-sm">
          A chave da API do Google Maps não foi configurada. Configure a variável de ambiente VITE_GOOGLE_MAPS_API_KEY.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] sm:h-[600px] rounded-2xl overflow-hidden shadow-lg border border-slate-200">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={saquaremaCenter}
          defaultZoom={15}
          mapId="saquarema-kiosks-map"
          disableDefaultUI={false}
          gestureHandling="greedy"
        >
          {kiosks.map((kiosk) => {
            if (!kiosk.lat || !kiosk.lng) return null;

            return (
              <AdvancedMarker
                key={kiosk.id}
                position={{ lat: kiosk.lat, lng: kiosk.lng }}
                onClick={() => setSelectedKiosk(kiosk)}
              >
                <Pin
                  background={kiosk.category === 'Restaurante' ? '#f59e0b' : '#004F8A'}
                  borderColor={kiosk.category === 'Restaurante' ? '#b45309' : '#002D52'}
                  glyphColor={'#ffffff'}
                >
                  <Store className="w-4 h-4 text-white" />
                </Pin>
              </AdvancedMarker>
            );
          })}

          {selectedKiosk && selectedKiosk.lat && selectedKiosk.lng && (
            <InfoWindow
              position={{ lat: selectedKiosk.lat, lng: selectedKiosk.lng }}
              onCloseClick={() => setSelectedKiosk(null)}
              headerContent={
                <div className="font-bold text-slate-900 text-sm truncate max-w-[200px]">
                  {selectedKiosk.name}
                </div>
              }
            >
              <div className="p-1 max-w-[220px]">
                <div className="w-full h-24 mb-2 rounded-lg overflow-hidden">
                  <img
                    src={selectedKiosk.image || FALLBACK_IMAGE}
                    alt={selectedKiosk.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedKiosk.reviewCount > 0 && (
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mb-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{selectedKiosk.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({selectedKiosk.reviewCount})</span>
                  </div>
                )}
                <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                  {selectedKiosk.specialty}
                </p>
                <p className="text-[10px] text-slate-500 flex items-start gap-1">
                  <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{selectedKiosk.distanceOrAddress}</span>
                </p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};
