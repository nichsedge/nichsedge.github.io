'use client';
import React from 'react';
import { Cpu, Users, Thermometer, BatteryCharging, AlertTriangle, Terminal, Brain, LineChart, BookOpen, Activity, Mic, Circle } from 'lucide-react';
import { TiltCard } from './tilt-card';
import { NoiseCancellationWidget } from './noise-cancellation';

export function HumanRuntime({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
      {/* Constraints & Environment */}
      <TiltCard>
        <div className="h-full border border-border-subtle bg-bg-1/50 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Thermometer size={100} />
          </div>
          <h3 className="font-mono text-accent text-[12px] uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
            <Thermometer size={14} /> {locale === 'id' ? 'Lingkungan Runtime' : 'Runtime Environment'}
          </h3>
          
          <ul className="space-y-4 text-[12px] font-mono leading-relaxed text-text-2 mb-6">
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">→</span>
              <div>
                <strong className="text-text-0 block">{locale === 'id' ? 'Hipersensitivitas I/O' : 'I/O Hypersensitivity'}</strong>
                {locale === 'id' 
                  ? 'Ruang kerja terbuka memicu kegagalan context-switching secara instan. Membutuhkan keheningan ekstrem untuk kerja mendalam dan tidur (target 0dB). Kerja hybrid jarak jauh masih dapat ditoleransi. Dapat berjalan tanpa batas dalam mode "hikikomori" yang terisolasi jika perbekalan (Makanan, WiFi, Token AI) terpenuhi.'
                  : 'Open offices trigger immediate context-switching faults. Requires extreme silence for deep work and sleep (0dB target). Hybrid remote is tolerable. Can run indefinitely in isolated "hikikomori" mode if provisions (Food, WiFi, AI Tokens) are supplied.'}
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">→</span>
              <div>
                <strong className="text-text-0 block">{locale === 'id' ? 'Bioma Pilihan' : 'Preferred Biomes'}</strong>
                {locale === 'id'
                  ? 'Lingkungan alam dengan kepadatan rendah. Sangat selaras dengan kode hex #0000FF (Laut) dan #008000 (Hutan).'
                  : 'Low-density natural environments. Strongly aligned with hex codes #0000FF (Ocean) and #008000 (Forests).'}
              </div>
            </li>
          </ul>

          <NoiseCancellationWidget />
        </div>
      </TiltCard>

      {/* Fuel Requirements */}
      <TiltCard>
        <div className="h-full border border-border-subtle bg-bg-1/50 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BatteryCharging size={100} />
          </div>
          <h3 className="font-mono text-accent text-[12px] uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
            <BatteryCharging size={14} /> {locale === 'id' ? 'Protokol Asupan Bahan Bakar' : 'Fuel Intake Protocols'}
          </h3>
          
          <ul className="space-y-4 text-[12px] font-mono leading-relaxed text-text-2">
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">→</span>
              <div>
                <strong className="text-text-0 block">{locale === 'id' ? 'Efisiensi > Rasa' : 'Efficiency > Flavor'}</strong>
                {locale === 'id'
                  ? 'Pendekatan utilitarian ekstrem terhadap konsumsi energi. Sangat puas dengan asupan hambar dan bernutrisi tinggi: oatmeal tanpa rasa, sayuran mentah, ayam goreng air-fryer tanpa bumbu, nasi putih biasa, dan air putih.'
                  : 'Extreme utilitarian approach to energy consumption. Perfectly content with bland, highly nutritious inputs: unflavored oatmeal, raw veg, zero-seasoning air-fried chicken, plain rice, and water.'}
              </div>
            </li>
            <li className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-500 mt-0.5 shrink-0" size={14} />
              <div>
                <strong className="text-yellow-500 block">{locale === 'id' ? 'Ketidakcocokan Perangkat Keras yang Diketahui' : 'Known Hardware Incompatibilities'}</strong>
                {locale === 'id'
                  ? 'Perangkat lunak menyukai Kopi dan Sambal. Perangkat keras secara aktif menolak keduanya.'
                  : 'Software loves Coffee and Sambal. Hardware actively rejects both.'} <br/>
                - <span className="text-text-3">Caffeine.exe</span>: {locale === 'id' ? 'Menyebabkan penguncian sumber daya yang parah (Insomnia hingga pukul 02:00 jika dikonsumsi pukul 09:00).' : 'Causes severe resource locking (Insomnia until 02:00 if ingested at 09:00).'} <br/>
                - <span className="text-text-3">Capsaicin.dll</span>: {locale === 'id' ? 'Sering memicu kegagalan sistem internal (Sakit perut).' : 'Frequently triggers internal system faults (Stomachache).'}
              </div>
            </li>
          </ul>
        </div>
      </TiltCard>

      {/* Allocated Compute */}
      <TiltCard>
        <div className="h-full border border-border-subtle bg-bg-1/50 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Cpu size={100} />
          </div>
          <h3 className="font-mono text-accent text-[12px] uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
            <Cpu size={14} /> {locale === 'id' ? 'Komputasi yang Dialokasikan' : 'Allocated Compute'}
          </h3>
          
          <div className="flex flex-wrap gap-3">
            {[
              { label: locale === 'id' ? 'Coding Vibe' : 'Vibe Coding', icon: Terminal },
              { label: locale === 'id' ? 'Filsafat Terapan' : 'Applied Philosophy', icon: Brain },
              { label: locale === 'id' ? 'Sistem Finansial' : 'Financial Systems', icon: LineChart },
              { label: locale === 'id' ? 'Ingesti Literatur' : 'Literature Ingestion', icon: BookOpen },
            ].map((item) => (
              <span key={item.label} className="px-2 py-1.5 bg-bg border border-border-subtle text-accent text-[10px] font-mono uppercase tracking-widest flex items-center gap-2">
                <item.icon size={12} /> {item.label}
              </span>
            ))}
          </div>
        </div>
      </TiltCard>

      {/* Multiplayer Modes */}
      <TiltCard>
        <div className="h-full border border-border-subtle bg-bg-1/50 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={100} />
          </div>
          <h3 className="font-mono text-accent text-[12px] uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
            <Users size={14} /> {locale === 'id' ? 'Mode Multipemain' : 'Multiplayer Modes'}
          </h3>
          
          <div className="flex flex-wrap gap-3">
            <span className="px-2 py-1.5 bg-bg border border-border-subtle text-text-2 hover:text-accent transition-colors text-[10px] font-mono uppercase tracking-widest border-l-2 border-l-accent flex items-center gap-2">
              <Activity size={12} /> Futsal / Mini Soccer
            </span>
            <span className="px-2 py-1.5 bg-bg border border-border-subtle text-text-2 hover:text-accent transition-colors text-[10px] font-mono uppercase tracking-widest border-l-2 border-l-accent flex items-center gap-2">
              <Mic size={12} /> {locale === 'id' ? 'Eksekusi Karaoke' : 'Karaoke Execution'}
            </span>
            <span className="px-2 py-1.5 bg-bg border border-border-subtle text-text-2 hover:text-accent transition-colors text-[10px] font-mono uppercase tracking-widest border-l-2 border-l-yellow-500 flex items-center gap-2">
              <Circle size={12} /> {locale === 'id' ? 'Tenis [v0.1 / Build Noob]' : 'Tennis [v0.1 / Noob Build]'}
            </span>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
