import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function HomePage() {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [resultJson, setResultJson] = useState<any>(null);
  const [errorText, setErrorText] = useState('');

  const handleHealthCheck = async () => {
    setStatus('loading');
    setErrorText('');
    setResultJson(null);

    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResultJson(data);
      setStatus('success');
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : 'Unknown error occurred');
      setStatus('error');
    }
  };

  const handleSend = async () => {
    // Validate input
    if (!inputText.trim()) {
      setStatus('error');
      setErrorText('Please enter some text before sending');
      setResultJson(null);
      return;
    }

    setStatus('loading');
    setErrorText('');
    setResultJson(null);

    try {
      const response = await fetch('/api/echo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResultJson(data);
      setStatus('success');
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : 'Unknown error occurred');
      setStatus('error');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'loading':
        return 'Loading...';
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      default:
        return 'Idle';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
        <h1 className="text-gray-900">MiniHub</h1>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Control Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>API Testing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Input */}
            <div>
              <Input
                type="text"
                placeholder="Type something…"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={status === 'loading'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleSend}
                disabled={status === 'loading'}
                className="flex-1"
              >
                Send
              </Button>
              <Button
                onClick={handleHealthCheck}
                disabled={status === 'loading'}
                variant="secondary"
                className="flex-1"
              >
                Health check
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Area */}
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Status:</span>
                <span className={`${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>

              {/* Error Message */}
              {errorText && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800">{errorText}</p>
                </div>
              )}

              {/* JSON Response */}
              {resultJson && (
                <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
                  <pre className="text-green-400 text-sm">
                    {JSON.stringify(resultJson, null, 2)}
                  </pre>
                </div>
              )}

              {/* Empty state */}
              {!errorText && !resultJson && status === 'idle' && (
                <div className="text-center py-8 text-gray-500">
                  No requests yet. Try the Health check or send some text.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
