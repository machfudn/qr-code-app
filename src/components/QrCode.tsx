import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps extends React.ComponentProps<typeof QRCodeSVG> {
  value: string;
  isDark?: boolean;
  size?: number;
  className?: string;
}

export const QRCode = ({ value, isDark = false, size = 192, className = '', ...rest }: QRCodeProps) => {
  const bgColor = isDark ? '#1f2937' : '#ffffff';
  const fgColor = isDark ? '#f3f4f6' : '#111827';

  return <QRCodeSVG value={value} size={size} level='H' bgColor={bgColor} fgColor={fgColor} className={className} {...rest} />;
};
