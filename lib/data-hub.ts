import resumeData from '@/data/cv.json';

export interface SystemStats {
  throughput: string;
  uptime: string;
  latency: string;
  activeNodes: number;
  cpuLoad: string;
}

export const getCVData = () => resumeData;
export const getResumeData = () => resumeData;

export const generateSystemStats = (): SystemStats => {
  // Semi-randomized stats to make the site feel live
  const now = new Date();
  const uptimeDays = Math.floor((now.getTime() - new Date('2023-01-01').getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    throughput: `${(Math.random() * 1.5 + 0.5).toFixed(2)} MB/s`,
    uptime: `${uptimeDays}D 12H 44M`,
    latency: `${(Math.random() * 20 + 15).toFixed(1)}ms`,
    activeNodes: 12,
    cpuLoad: `${(Math.random() * 15 + 5).toFixed(1)}%`,
  };
};
