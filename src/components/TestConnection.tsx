import React, { useState } from 'react';
import { authService } from '../services/authService';

const TestConnection: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setResult('');
    
    try {
      // Test health endpoint first
      const healthResponse = await authService.healthCheck();
      setResult(`✅ Health check: ${healthResponse.message}\n`);
      
      // Test registration
      const registerResponse = await authService.register({
        user_name: 'testuser' + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      });
      setResult(prev => prev + `✅ Registration: ${registerResponse.message}\n`);
      
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Backend Connection Test</h1>
      
      <button
        onClick={testBackendConnection}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-4 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      
      <pre className="bg-gray-800 p-4 rounded whitespace-pre-wrap">
        {result || 'Click the button to test connection...'}
      </pre>
    </div>
  );
};

export default TestConnection;
