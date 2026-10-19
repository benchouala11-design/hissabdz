import './globals.css';

export const metadata = {
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg' },
    ],
    shortcut: ['/icon.svg'],
  },
};

export default function RootLayout({ children }) {
  return children;
}
