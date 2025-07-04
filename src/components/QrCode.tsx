// components/QrCode.tsx
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  value: string;
  isDark?: boolean;
  size?: number;
  className?: string;
}

export const QRCode = ({ value, isDark = false, size = 192, className = '' }: QRCodeProps) => (
  <QRCodeSVG
    value={value}
    size={size}
    bgColor={isDark ? '#1f2937' : '#ffffff'} // dark:bg-gray-800 / white
    fgColor={isDark ? '#f3f4f6' : '#111827'} // dark:text-gray-100 / gray-900
    level='H'
    className={className}
  />
);
