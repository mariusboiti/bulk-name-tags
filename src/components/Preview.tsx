import { useState } from 'react';

interface PreviewProps {
  svgContent: string | null;
  isGenerating: boolean;
}

export function Preview({ svgContent, isGenerating }: PreviewProps) {
  const [zoom, setZoom] = useState(100);

  const containerAlignmentClass = svgContent && !isGenerating
    ? 'items-start justify-start'
    : 'items-center justify-center';

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Preview</h2>
        
        {svgContent && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Zoom:</label>
            <input
              type="range"
              min="50"
              max="200"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-gray-600 w-12">{zoom}%</span>
          </div>
        )}
      </div>
      
      <div className={`border-2 border-dashed border-gray-300 rounded-lg flex-1 min-h-0 flex ${containerAlignmentClass} bg-gray-50 overflow-auto`}>
        {isGenerating ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating preview...</p>
          </div>
        ) : svgContent ? (
          <div 
            className="p-4"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Load a template and provide names to see preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
