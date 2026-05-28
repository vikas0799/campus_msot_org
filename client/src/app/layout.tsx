import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'Campus MSOT | Centralized Student Community Platform',
  description: 'The centralized student hub for all MSOT campuses (Ghaziabad, Jaipur, Bangalore) for placements, coding hackathons, student blogs, and developer communities.',
  keywords: 'MSOT, student community, hackathons, placements, coding culture, Ghaziabad, Jaipur, Bangalore',
  authors: [{ name: 'Campus MSOT Team' }],
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-grow flex flex-col">{children}</main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
