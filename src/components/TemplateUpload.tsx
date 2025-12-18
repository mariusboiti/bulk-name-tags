import { useState } from 'react';
import { templateLibrary } from '../templateLibrary';
import { parseTemplateBounds } from '../utils/svgUtils';
import type { TemplateSizeConfig, UnitSystem } from '../types';

interface TemplateUploadProps {
  onTemplateLoad: (svg: string) => void;
  templateSvg: string | null;
  unitSystem: UnitSystem;
  templateSize: TemplateSizeConfig | null;
  onTemplateSizeChange: (next: TemplateSizeConfig | null) => void;
}

export function TemplateUpload({ onTemplateLoad, templateSvg, unitSystem, templateSize, onTemplateSizeChange }: TemplateUploadProps) {
  const [error, setError] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const mmToIn = (mm: number) => mm / 25.4;
  const inToMm = (inch: number) => inch * 25.4;
  const toDisplay = (mm: number) => (unitSystem === 'in' ? mmToIn(mm) : mm);
  const fromDisplay = (value: number) => (unitSystem === 'in' ? inToMm(value) : value);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.svg')) {
      setError('Please upload an SVG file');
      return;
    }

    try {
      const text = await file.text();
      if (!text.includes('<svg')) {
        setError('Invalid SVG file');
        return;
      }
      setError('');
      setSelectedTemplateId('');
      onTemplateLoad(text);
    } catch {
      setError('Failed to read file');
    }
  };

  const handleExampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedTemplateId(id);

    if (!id) return;

    const selected = templateLibrary.find(t => t.id === id);
    if (!selected) return;

    setError('');
    onTemplateLoad(selected.svg);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-2">Step 1: Upload Template</h2>
      <p className="text-sm text-gray-600 mb-4">
        Upload your base SVG template (tag/badge/ornament shape). The template should use millimeters as units.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Or choose an example template
        </label>
        <select
          value={selectedTemplateId}
          onChange={handleExampleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select an example --</option>
          {templateLibrary.map(t => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {selectedTemplateId && (
          <p className="text-xs text-gray-500 mt-1">
            {templateLibrary.find(t => t.id === selectedTemplateId)?.description}
          </p>
        )}
      </div>
      
      <input
        type="file"
        accept=".svg"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {templateSvg && templateSize && (() => {
        let bounds: { width: number; height: number } | null = null;
        try {
          const parsed = parseTemplateBounds(templateSvg);
          bounds = { width: parsed.width, height: parsed.height };
        } catch {
          bounds = null;
        }

        const aspect = bounds ? bounds.width / bounds.height : null;

        return (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Template size</h3>

            {bounds && (
              <div className="text-xs text-gray-500 mb-3">
                Original: {Number(toDisplay(bounds.width).toFixed(unitSystem === 'in' ? 3 : 1))}{unitSystem} × {Number(toDisplay(bounds.height).toFixed(unitSystem === 'in' ? 3 : 1))}{unitSystem}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width ({unitSystem})
                </label>
                <input
                  type="number"
                  min="0"
                  step={unitSystem === 'in' ? '0.01' : '0.5'}
                  value={Number(toDisplay(templateSize.width).toFixed(unitSystem === 'in' ? 3 : 1))}
                  onChange={(e) => {
                    const nextWidth = fromDisplay(Number(e.target.value));
                    if (!aspect || !templateSize.lockAspect) {
                      onTemplateSizeChange({ ...templateSize, width: nextWidth });
                      return;
                    }
                    onTemplateSizeChange({ ...templateSize, width: nextWidth, height: nextWidth / aspect });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height ({unitSystem})
                </label>
                <input
                  type="number"
                  min="0"
                  step={unitSystem === 'in' ? '0.01' : '0.5'}
                  value={Number(toDisplay(templateSize.height).toFixed(unitSystem === 'in' ? 3 : 1))}
                  onChange={(e) => {
                    const nextHeight = fromDisplay(Number(e.target.value));
                    if (!aspect || !templateSize.lockAspect) {
                      onTemplateSizeChange({ ...templateSize, height: nextHeight });
                      return;
                    }
                    onTemplateSizeChange({ ...templateSize, height: nextHeight, width: nextHeight * aspect });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={templateSize.lockAspect}
                  onChange={(e) => onTemplateSizeChange({ ...templateSize, lockAspect: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                Lock aspect ratio
              </label>

              <button
                type="button"
                onClick={() => {
                  if (!bounds) return;
                  onTemplateSizeChange({ width: bounds.width, height: bounds.height, lockAspect: templateSize.lockAspect });
                }}
                className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50"
              >
                Reset to original
              </button>
            </div>
          </div>
        );
      })()}
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
      
      {templateSvg && (
        <div className="mt-4">
          <p className="text-sm font-medium text-green-600 mb-2">✓ Template loaded</p>
          <div className="border border-gray-200 rounded p-4 bg-gray-50 max-h-48 overflow-auto">
            <div dangerouslySetInnerHTML={{ __html: templateSvg }} className="flex justify-center" />
          </div>
        </div>
      )}
    </div>
  );
}
