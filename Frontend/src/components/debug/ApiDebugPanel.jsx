import { useState, useEffect } from 'react';

const ApiDebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Only show in development
    if (import.meta.env.VITE_DEBUG !== 'true') return;

    // Override console methods to capture API logs
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      if (args[0]?.includes?.('API Call') || args[0]?.includes?.('📦')) {
        setLogs(prev => [...prev.slice(-9), {
          type: 'log',
          timestamp: new Date().toLocaleTimeString(),
          message: args.join(' ')
        }]);
      }
      originalLog(...args);
    };

    console.error = (...args) => {
      if (args[0]?.includes?.('API Error') || args[0]?.includes?.('❌')) {
        setLogs(prev => [...prev.slice(-9), {
          type: 'error',
          timestamp: new Date().toLocaleTimeString(),
          message: args.join(' ')
        }]);
      }
      originalError(...args);
    };

    console.warn = (...args) => {
      if (args[0]?.includes?.('Status 304') || args[0]?.includes?.('🔄')) {
        setLogs(prev => [...prev.slice(-9), {
          type: 'warn',
          timestamp: new Date().toLocaleTimeString(),
          message: args.join(' ')
        }]);
      }
      originalWarn(...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  if (import.meta.env.VITE_DEBUG !== 'true') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        title="API Debug Panel"
      >
        🔧
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 w-96 max-h-64 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gray-100 px-3 py-2 border-b flex justify-between items-center">
            <h3 className="font-semibold text-sm">API Debug Log</h3>
            <button
              onClick={() => setLogs([])}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Clear
            </button>
          </div>
          
          <div className="max-h-48 overflow-y-auto p-2">
            {logs.length === 0 ? (
              <div className="text-gray-500 text-sm">No API calls logged yet...</div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`text-xs mb-1 p-1 rounded ${
                    log.type === 'error'
                      ? 'bg-red-50 text-red-700'
                      : log.type === 'warn'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  <span className="text-gray-500">{log.timestamp}</span>
                  <div>{log.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDebugPanel;
