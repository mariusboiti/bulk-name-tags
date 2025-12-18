import type { EmbeddedFontFormat, TextLayoutConfig, UnitSystem } from '../types';

interface TextSettingsProps {
  config: TextLayoutConfig;
  onChange: (config: TextLayoutConfig) => void;
  unitSystem: UnitSystem;
}

export function TextSettings({ config, onChange, unitSystem }: TextSettingsProps) {
  const updateConfig = (updates: Partial<TextLayoutConfig>) => {
    onChange({ ...config, ...updates });
  };

  const mmToIn = (mm: number) => mm / 25.4;
  const inToMm = (inch: number) => inch * 25.4;
  const toDisplay = (mm: number) => (unitSystem === 'in' ? mmToIn(mm) : mm);
  const fromDisplay = (value: number) => (unitSystem === 'in' ? inToMm(value) : value);

  const updateFontFamily = (fontFamily: string) => {
    const embeddedFont = config.embeddedFont
      ? { ...config.embeddedFont, fontFamily }
      : config.embeddedFont;

    onChange({
      ...config,
      fontFamily,
      embeddedFont
    });
  };

  const getFormatFromFileName = (name: string): EmbeddedFontFormat | null => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'ttf') return 'truetype';
    if (ext === 'otf') return 'opentype';
    if (ext === 'woff') return 'woff';
    if (ext === 'woff2') return 'woff2';
    return null;
  };

  const fontOptions: Array<{ value: string; label: string }> = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Tahoma', label: 'Tahoma' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS' },
    { value: 'Segoe UI', label: 'Segoe UI' },
    { value: 'Calibri', label: 'Calibri' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Garamond', label: 'Garamond' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Consolas', label: 'Consolas' },
    { value: 'Impact', label: 'Impact' },
    { value: 'Comic Sans MS', label: 'Comic Sans MS' },
    { value: 'sans-serif', label: 'Generic: sans-serif' },
    { value: 'serif', label: 'Generic: serif' },
    { value: 'monospace', label: 'Generic: monospace' },
    { value: 'cursive', label: 'Generic: cursive' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-2">Step 3: Text & Layout Settings</h2>
      <p className="text-sm text-gray-600 mb-4">
        Configure how text appears on your name tags.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horizontal Alignment
          </label>
          <select
            value={config.horizontalAlignment}
            onChange={(e) => updateConfig({ horizontalAlignment: e.target.value as 'left' | 'center' | 'right' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horizontal Position: {typeof config.horizontalPosition === 'number' ? config.horizontalPosition : 50}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={typeof config.horizontalPosition === 'number' ? config.horizontalPosition : 50}
            onChange={(e) => updateConfig({ horizontalPosition: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Left</span>
            <span>Right</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vertical Position: {config.verticalPosition}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={config.verticalPosition}
            onChange={(e) => updateConfig({ verticalPosition: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Top</span>
            <span>Bottom</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Text Width: {config.maxTextWidth}%
          </label>
          <input
            type="range"
            min="20"
            max="100"
            value={config.maxTextWidth}
            onChange={(e) => updateConfig({ maxTextWidth: Number(e.target.value) })}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Family
          </label>
          <select
            value={config.fontFamily}
            onChange={(e) => updateFontFamily(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fontOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="mt-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Or type a custom font-family
            </label>
            <input
              type="text"
              value={config.fontFamily}
              onChange={(e) => updateFontFamily(e.target.value)}
              placeholder="e.g. Arial, 'Open Sans', sans-serif"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Upload custom font file (embedded in SVG)
            </label>

            <input
              id="embedded-font-upload"
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const format = getFormatFromFileName(file.name);
                if (!format) return;

                const defaultFamily = file.name.replace(/\.[^/.]+$/, '');
                const reader = new FileReader();

                reader.onload = () => {
                  const dataUrl = typeof reader.result === 'string' ? reader.result : '';
                  if (!dataUrl) return;

                  onChange({
                    ...config,
                    fontFamily: defaultFamily,
                    embeddedFont: {
                      fontFamily: defaultFamily,
                      dataUrl,
                      format
                    }
                  });
                };

                reader.readAsDataURL(file);
              }}
              className="hidden"
            />

            <label
              htmlFor="embedded-font-upload"
              className="mt-1 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Choose font file
            </label>

            <div className="mt-1 text-xs text-gray-500">
              Accepted: .ttf, .otf, .woff, .woff2
            </div>

            {config.embeddedFont && (
              <div className="mt-2 flex items-center justify-between gap-3 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded p-2">
                <div className="truncate">
                  Embedded: {config.embeddedFont.fontFamily} ({config.embeddedFont.format})
                </div>
                <button
                  type="button"
                  onClick={() => updateConfig({ embeddedFont: null })}
                  className="px-2 py-1 rounded bg-white border border-gray-300 hover:bg-gray-100"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size ({unitSystem})
            </label>
            <input
              type="number"
              min="1"
              max="50"
              step={unitSystem === 'in' ? '0.01' : '0.5'}
              value={Number(toDisplay(config.fontSize).toFixed(unitSystem === 'in' ? 3 : 2))}
              onChange={(e) => updateConfig({ fontSize: fromDisplay(Number(e.target.value)) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Letter Spacing ({unitSystem})
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step={unitSystem === 'in' ? '0.001' : '0.1'}
              value={Number(toDisplay(config.letterSpacing).toFixed(unitSystem === 'in' ? 4 : 3))}
              onChange={(e) => updateConfig({ letterSpacing: fromDisplay(Number(e.target.value)) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text Case
          </label>
          <select
            value={config.textCase}
            onChange={(e) => updateConfig({ textCase: e.target.value as 'as-is' | 'uppercase' | 'capitalize' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="as-is">As-Is</option>
            <option value="uppercase">UPPERCASE</option>
            <option value="capitalize">Capitalize</option>
          </select>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="secondLine"
              checked={config.secondLineEnabled}
              onChange={(e) => updateConfig({ secondLineEnabled: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="secondLine" className="ml-2 block text-sm font-medium text-gray-700">
              Enable Second Line
            </label>
          </div>
          
          {config.secondLineEnabled && (
            <div className="space-y-3 ml-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Font Size ({unitSystem})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    step={unitSystem === 'in' ? '0.01' : '0.5'}
                    value={Number(toDisplay(config.secondLineFontSize).toFixed(unitSystem === 'in' ? 3 : 2))}
                    onChange={(e) => updateConfig({ secondLineFontSize: fromDisplay(Number(e.target.value)) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vertical Offset ({unitSystem})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step={unitSystem === 'in' ? '0.01' : '0.5'}
                    value={Number(toDisplay(config.secondLineVerticalOffset).toFixed(unitSystem === 'in' ? 3 : 2))}
                    onChange={(e) => updateConfig({ secondLineVerticalOffset: fromDisplay(Number(e.target.value)) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
