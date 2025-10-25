import { useState } from 'react';
import backend from './client';

export default function TestCareBuddy() {
  const [status, setStatus] = useState<string>('Ready to test');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testStartConversation = async () => {
    try {
      setStatus('Testing startConversation...');
      setError('');
      setResult(null);
      
      console.log('Testing carebuddy.startConversation...');
      const response = await backend.carebuddy.startConversation({});
      console.log('Start conversation response:', response);
      
      setResult(response);
      setStatus('✅ Start conversation successful!');
    } catch (err: any) {
      console.error('Start conversation error:', err);
      setError(err.message || 'Unknown error');
      setStatus('❌ Start conversation failed');
    }
  };

  const testSendMessage = async () => {
    try {
      setStatus('Testing sendMessage...');
      setError('');
      setResult(null);
      
      console.log('Testing carebuddy.sendMessage...');
      const response = await backend.carebuddy.sendMessage({ 
        conversationId: 1, 
        content: "Hello, this is a test message" 
      });
      console.log('Send message response:', response);
      
      setResult(response);
      setStatus('✅ Send message successful!');
    } catch (err: any) {
      console.error('Send message error:', err);
      setError(err.message || 'Unknown error');
      setStatus('❌ Send message failed');
    }
  };

  const checkClientServices = () => {
    try {
      console.log('Available services:', Object.keys(backend));
      console.log('Carebuddy service available:', !!backend.carebuddy);
      console.log('Carebuddy methods:', backend.carebuddy ? Object.getOwnPropertyNames(Object.getPrototypeOf(backend.carebuddy)) : 'Not available');
      
      setStatus('Client services checked (see console)');
    } catch (err: any) {
      setError(err.message);
      setStatus('Error checking client');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 CareBuddy Client Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={checkClientServices}
          style={{ padding: '10px 15px', margin: '5px', cursor: 'pointer' }}
        >
          Check Client Services
        </button>
        <button 
          onClick={testStartConversation}
          style={{ padding: '10px 15px', margin: '5px', cursor: 'pointer' }}
        >
          Test Start Conversation
        </button>
        <button 
          onClick={testSendMessage}
          style={{ padding: '10px 15px', margin: '5px', cursor: 'pointer' }}
        >
          Test Send Message
        </button>
      </div>

      <div style={{ 
        padding: '15px', 
        borderRadius: '5px', 
        backgroundColor: error ? '#f8d7da' : result ? '#d4edda' : '#d1ecf1',
        border: `1px solid ${error ? '#f5c6cb' : result ? '#c3e6cb' : '#bee5eb'}`
      }}>
        <h3>Status: {status}</h3>
        
        {error && (
          <div>
            <h4>Error:</h4>
            <pre style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '3px', overflowX: 'auto' }}>
              {error}
            </pre>
          </div>
        )}
        
        {result && (
          <div>
            <h4>Result:</h4>
            <pre style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '3px', overflowX: 'auto' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>Expected Behavior:</h4>
        <ul>
          <li><strong>Check Client Services:</strong> Should show carebuddy service is available</li>
          <li><strong>Test Start Conversation:</strong> Should either succeed or return "unauthenticated" (which means the endpoint is working)</li>
          <li><strong>Test Send Message:</strong> Should either succeed or return "unauthenticated" (which means the endpoint is working)</li>
        </ul>
        <p><strong>Note:</strong> "unauthenticated" errors are expected if you're not logged in. This means the client integration is working correctly!</p>
      </div>
    </div>
  );
}