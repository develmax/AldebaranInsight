import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResumeUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile?: File;
  onRemove?: () => void;
  error?: string;
}

const ResumeUploader = ({ onFileSelect, selectedFile, onRemove, error }: ResumeUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-50'
              : error
              ? 'border-red-300 hover:border-red-500'
              : 'border-gray-300 hover:border-indigo-500'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className={`h-8 w-8 mx-auto mb-4 ${error ? 'text-red-400' : 'text-gray-400'}`} />
          <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-600'}`}>
            {error || (isDragActive
              ? 'Drop the resume here'
              : 'Drag and drop a resume, or click to select')}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: PDF, TXT
          </p>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <File className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            {onRemove && (
              <button
                onClick={onRemove}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Remove file"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ResumeUploader;