import type { Metadata, Viewport } from 'next';
import '../styles/cinematic.css';
import { AnimationProvider } from '../providers/AnimationProvider';
import { SmoothScrollProvider } from '../providers/SmoothScrollProvider';

export const metadata: Metadata = {
  title: 'IEEE GRSS — Observe Beyond Vision',
  description:
    'The IEEE Geoscience and Remote Sensing Society — advancing the science of Earth observation through remote sensing technologies and applications.',
  keywords: [
    'IEEE GRSS',
    'Geoscience',
    'Remote Sensing',
    'Earth Observation',
    'SAR',
    'LiDAR',
    'Satellite Imaging',
    'IEEE',
    'IGARSS',
  ],
  authors: [{ name: 'IEEE GRSS' }],
  openGraph: {
    title: 'IEEE GRSS — Observe Beyond Vision',
    description: 'Advancing the science of Earth observation.',
    type: 'website',
    locale: 'en_US',
    siteName: 'IEEE GRSS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IEEE GRSS — Observe Beyond Vision',
    description: 'Advancing the science of Earth observation.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#03050a',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ background: '#03050a' }}>
      <body>
        <AnimationProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </AnimationProvider>
      </body>
    </html>
  );
}
