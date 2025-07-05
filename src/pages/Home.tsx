import { useState, useRef, useEffect } from 'react';
import { QRCode } from '@/components/QrCode';
import html2canvas from 'html2canvas';

import Theme from '@/components/Theme';
import { useToast } from '@/components/Toast';
import { IconX, IconDownload, IconCheck, IconXmark } from '@/components/Icons';

const Home = () => {
  const toast = useToast();
  const [input, setInput] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [submitInput, setSubmitInput] = useState('');
  const [message, setMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [touched, setTouched] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains('dark'));

    const observer = new MutationObserver(() => {
      setIsDark(html.classList.contains('dark'));
    });

    observer.observe(html, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const isValidUrl = (url: string) => {
    const pattern = new RegExp('^(https?://)' + '([\\w\\d-]+.)+[\\w\\d]{2,}' + '(/\\S*)?$', 'i');
    return pattern.test(url);
  };

  const trimmedInput = input.trim();

  const generateQRCode = (e: React.FormEvent) => {
    e.preventDefault();

    if (!trimmedInput) {
      setShowError(true);
      setMessage('URL kosong');
      return;
    }

    if (!isValidUrl(trimmedInput)) {
      setShowError(true);
      setMessage('URL tidak valid. Harus diawali http:// atau https://');
      return;
    }

    setIsLoading(true);

    try {
      setSubmitInput(trimmedInput);
      setQrCode(trimmedInput); // Jika menggunakan QRCode.toDataURL, ganti dengan await
      setShowSuccess(true);
      toast.success('Berhasil membuat QR Code!');
    } catch (error) {
      toast.error('Terjadi kesalahan saat membuat QR Code');
      setShowError(true);
      setMessage('Gagal membuat QR Code:' + error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!touched) return;

    if (!trimmedInput) {
      setShowError(true);
      setShowSuccess(false);
      setMessage('Input tidak boleh kosong');
      return;
    }

    if (!isValidUrl(trimmedInput)) {
      setShowError(true);
      setShowSuccess(false);
      setMessage('URL tidak valid. Harus diawali http:// atau https://');
      return;
    }
    setShowSuccess(true);
    setShowError(false);
    setMessage('');
  }, [input, touched]);

  const resetQRCode = () => {
    try {
      setMessage('');
      setQrCode('');
      setInput('');
      setShowError(false);
      setShowSuccess(false);
      setTouched(false);
      toast.success('QR Code berhasil di reset');
    } catch (error) {
      toast.error('QR Code gagal di reset:' + error);
    }
  };
  const getFileName = (base = 'qrcode') => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${base}-${day}-${month}-${year}`;
  };
  const fileName = getFileName();

  const downloadQRCodeAsImage = async () => {
    if (!qrCodeRef.current) {
      toast.error('QR Code element not found');
      return;
    }

    try {
      toast.info('Preparing download...');
      interface CustomHtml2CanvasOptions {
        scale?: number;
        logging?: boolean;
        useCORS?: boolean;
      }
      const canvas = await html2canvas(qrCodeRef.current!, {
        scale: 2,
        logging: false,
        useCORS: true,
      } as CustomHtml2CanvasOptions);
      // Buat link download
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png', 1.0); // Kualitas maksimal
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download completed!');
    } catch (error) {
      toast.error(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className='max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
      <form onSubmit={generateQRCode} className='mb-4'>
        <div className='mb-4'>
          <label htmlFor='qr-input' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Masukan URL
          </label>
          <div className='relative'>
            <input
              value={input}
              name='qr-input'
              id='qr-input'
              onChange={e => setInput(e.target.value)}
              onBlur={() => setTouched(true)}
              className={`w-full pr-10 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2
      ${
        showError
          ? 'border-red-500 focus:ring-red-500'
          : showSuccess
          ? 'border-green-500 focus:ring-green-500'
          : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
      }
      dark:bg-gray-700 dark:text-white`}
              placeholder='https://example.com'
            />

            {showError && (
              <span className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                <IconXmark className='w-5 h-5 fill-red-500' />
              </span>
            )}
            {showSuccess && !showError && (
              <span className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                <IconCheck className='w-5 h-5 fill-green-500' />
              </span>
            )}
          </div>

          {showError && <p className='text-sm text-red-500 mt-1'>{message}</p>}
        </div>

        <div className='flex flex-col md:flex-row flex-wrap gap-2 mb-4'>
          <div className='flex flex-wrap gap-2'>
            <Theme />
            <button
              type='submit'
              disabled={isLoading}
              className={`flex-1 py-2 px-4 rounded-md transition-colors text-white ${
                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}>
              {isLoading ? 'Generate...' : 'Generate'}
            </button>
          </div>

          {qrCode && (
            <div className='flex flex-col sm:flex-row md:flex-1 w-full gap-2'>
              <button
                type='button'
                onClick={resetQRCode}
                className='flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors'>
                Reset
              </button>
              <button
                type='button'
                onClick={() => setIsModalOpen(true)}
                className='flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors'>
                Display QR Code
              </button>
            </div>
          )}
        </div>
      </form>

      {qrCode && (
        <div className='mt-6'>
          {/* Tampilan utama */}
          <div className='flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700'>
            <QRCode value={submitInput} isDark={isDark} />
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-300 break-all max-w-xs text-center'>{submitInput}</p>
          </div>

          {/* Hidden div untuk download */}
          {/* Versi untuk download */}
          <div
            ref={qrCodeRef}
            style={{
              position: 'absolute',
              left: '-9999px',
              top: '-9999px',
              padding: '1.5rem',
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 'fit-content',
            }}>
            <QRCode value={submitInput} size={256} bgColor={isDark ? '#1f2937' : '#ffffff'} fgColor={isDark ? '#f3f4f6' : '#111827'} />
            <p
              style={{
                marginTop: '1rem',
                color: isDark ? '#f3f4f6' : '#111827',
                fontSize: '0.875rem',
                maxWidth: '16rem',
                textAlign: 'center',
              }}>
              {submitInput}
            </p>
            <p
              style={{
                marginTop: '0.5rem',
                color: isDark ? '#d1d5db' : '#6b7280',
                fontSize: '0.75rem',
              }}>
              Generated by QR Code App
            </p>
          </div>

          {/* Tombol download */}
          <div className='flex flex-wrap gap-2 mt-4'>
            <button
              type='button'
              onClick={downloadQRCodeAsImage}
              className='flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2'
              disabled={!qrCode}>
              <IconDownload />
              Download Image
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4'>
          <div className='bg-white dark:bg-gray-900 rounded-lg p-6 max-w-sm w-full relative' onClick={e => e.stopPropagation()}>
            {/* Header dengan judul di tengah dan tombol close di kanan */}
            <div className='relative mb-4'>
              <h2 className='text-xl font-bold text-gray-800 dark:text-white text-center'>QR Code</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className='absolute top-0 right-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
                <IconX />
              </button>
            </div>

            {/* Konten QR Code */}
            <div className='flex justify-center p-4 bg-white dark:bg-gray-900 rounded-md'>
              <QRCode value={submitInput} isDark={isDark} size={256} />
            </div>
            <p className='mt-4 text-sm text-gray-600 dark:text-gray-300 text-center break-all'>{submitInput}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
