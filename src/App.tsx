import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200'>
      <Toaster position='top-center' />
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold text-center text-gray-800 dark:text-white mb-8'>QR Code App</h1>
        <Home />
      </div>
    </div>
  );
}

export default App;
