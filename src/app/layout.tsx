import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { FeatureFlagProvider } from '../context/FeatureFlagContext';
import './globals.css';
import { StorageProvider } from '@/context/StorageContext';
import { ThemeProvider } from '@/components/theme-provider';
import GoogleTagManager from '@/components/GoogleTagManager';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Sitecore Copilot',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StorageProvider>
      <FeatureFlagProvider>
        <html lang="en" suppressHydrationWarning>
          <head>
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''} />
          </head>
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </body>
        </html>
      </FeatureFlagProvider>
    </StorageProvider>
  );
}
