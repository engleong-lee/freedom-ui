import React, { useState, useEffect } from 'react';
import { Analysis } from '../types/analysis';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { updateRemarks } from '../utils/api';
import '../styles/analysis.css';

interface AnalysisContentProps {
  analysis: Analysis;
  onRemarksUpdate?: (recordId: number, remarks: string) => void;
  className?: string;
}

// Custom components for ReactMarkdown
const markdownComponents: Components = {
  h1: ({children}) => (
    <h1 className="text-2xl font-bold mb-6 text-gray-900">
      {children}
    </h1>
  ),
  h2: ({children}) => (
    <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">
      {children}
    </h2>
  ),
  h3: ({children}) => (
    <h3 className="text-lg font-semibold mt-4 mb-3 text-gray-800">
      {children}
    </h3>
  ),
  p: ({children}) => (
    <p className="mb-4 text-gray-700 leading-relaxed">
      {children}
    </p>
  ),
  ul: ({children}) => (
    <ul className="mb-4 ml-6 list-disc space-y-1">
      {children}
    </ul>
  ),
  ol: ({children}) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1">
      {children}
    </ol>
  ),
  li: ({children}) => (
    <li className="text-gray-700 leading-relaxed">
      {children}
    </li>
  ),
  strong: ({children}) => (
    <strong className="font-semibold text-gray-900">
      {children}
    </strong>
  ),
  em: ({children}) => (
    <em className="italic">
      {children}
    </em>
  ),
  blockquote: ({children}) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-600">
      {children}
    </blockquote>
  ),
  code: ({className, children, ...props}) => {
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !match;
    
    if (isInline) {
      return (
        <code className="bg-gray-100 rounded px-1.5 py-0.5 text-sm font-mono text-gray-800">
          {children}
        </code>
      );
    }
    
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({children}) => (
    <pre className="bg-gray-100 rounded p-4 overflow-x-auto mb-4 text-sm font-mono">
      {children}
    </pre>
  ),
  hr: () => (
    <hr className="my-8 border-t border-gray-300" />
  ),
  table: ({children}) => (
    <table className="w-full mb-4 border-collapse">
      {children}
    </table>
  ),
  thead: ({children}) => (
    <thead className="border-b-2 border-gray-300">
      {children}
    </thead>
  ),
  tbody: ({children}) => (
    <tbody>
      {children}
    </tbody>
  ),
  tr: ({children}) => (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      {children}
    </tr>
  ),
  th: ({children}) => (
    <th className="text-left font-semibold text-gray-900 p-2">
      {children}
    </th>
  ),
  td: ({children}) => (
    <td className="p-2">
      {children}
    </td>
  ),
};

export function AnalysisContent({ analysis, onRemarksUpdate, className }: AnalysisContentProps) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'prompt' | 'decision' | 'remarks'>('analysis');
  const [remarks, setRemarks] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [currentRecordId, setCurrentRecordId] = useState<number>(analysis.recordId);

  // Load remarks when switching to a different analysis
  useEffect(() => {
    // Check if we're actually switching to a different analysis
    if (analysis.recordId !== currentRecordId) {
      setRemarks(analysis.remarks || '');
      setSaveMessage(null);
      setCurrentRecordId(analysis.recordId);
    }
  }, [analysis, currentRecordId]);

  const handleSaveRemarks = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      await updateRemarks(analysis.recordId, remarks);
      setSaveMessage({ type: 'success', text: 'Remarks saved successfully!' });
      
      // Update the parent component's state
      if (onRemarksUpdate) {
        onRemarksUpdate(analysis.recordId, remarks);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to save remarks:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save remarks. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm flex flex-col h-full ${className || ''}`}>
      <div className="border-b border-gray-200 flex-shrink-0 overflow-x-auto analysis-tabs">
        <nav className="flex -mb-px min-w-max">
          <button 
            className={`py-3 px-4 sm:py-4 sm:px-6 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === 'analysis' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`} 
            onClick={() => setActiveTab('analysis')}
          >
            Analysis
          </button>
          <button 
            className={`py-3 px-4 sm:py-4 sm:px-6 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === 'prompt' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`} 
            onClick={() => setActiveTab('prompt')}
          >
            Analysis Prompt
          </button>
          <button 
            className={`py-3 px-4 sm:py-4 sm:px-6 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === 'decision' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`} 
            onClick={() => setActiveTab('decision')}
          >
            Decision
          </button>
          <button 
            className={`py-3 px-4 sm:py-4 sm:px-6 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === 'remarks' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`} 
            onClick={() => setActiveTab('remarks')}
          >
            Remarks
          </button>
        </nav>
      </div>
      
      <div className="p-4 sm:p-6 flex-1 min-h-0 overflow-y-auto custom-scrollbar analysis-markdown-content analysis-content-area">
        {activeTab === 'analysis' && (
          <div className="max-w-none">
            <ReactMarkdown components={markdownComponents}>
              {analysis.analysis_content}
            </ReactMarkdown>
          </div>
        )}
        
        {activeTab === 'prompt' && (
          <div className="max-w-none">
            <ReactMarkdown components={markdownComponents}>
              {analysis.analysis_prompt}
            </ReactMarkdown>
          </div>
        )}
        
        {activeTab === 'decision' && (
          <pre className="bg-gray-50 p-4 rounded text-sm font-mono text-gray-700">
            {JSON.stringify(analysis.decision, null, 2)}
          </pre>
        )}
        
        {activeTab === 'remarks' && (
          <div className="flex flex-col">
            <div className="flex-1 mb-4">
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter your remarks here..."
                className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSaving}
              />
            </div>
            
            {/* Save message */}
            {saveMessage && (
              <div className={`mt-2 text-sm ${
                saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {saveMessage.text}
              </div>
            )}
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSaveRemarks}
                disabled={isSaving}
                className={`px-4 sm:px-6 py-2 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                  isSaving 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}