import React, { useState } from 'react';
import { Save, Key, Brain, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_OPENAI_API_KEY || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      // In a real application, you would save this securely
      // For demo purposes, we'll just validate the key format
      if (!apiKey.startsWith('sk-')) {
        throw new Error('Invalid API key format. Key should start with "sk-"');
      }

      // Update the environment variable
      import.meta.env.VITE_OPENAI_API_KEY = apiKey;

      setMessage({
        type: 'success',
        text: 'Settings saved successfully!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to save settings'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">AI Configuration</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OpenAI API Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="sk-..."
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter your OpenAI API key to enable AI features. You can find your API key in your
                OpenAI dashboard.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Current Model</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">GPT-4o-mini</p>
                    <p className="text-sm text-gray-500">
                      Optimized for recruitment and resume analysis
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {message.type === 'success' ? (
                  <Save className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <p className="text-sm font-medium">{message.text}</p>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex justify-end px-6 py-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Save className="h-5 w-5 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;