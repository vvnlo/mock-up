import DropZone from './DropZone';
import { BACKGROUNDS } from '../lib/backgrounds';
import { exportComposition } from '../lib/canvasRenderer';
import { useImageLoader } from '../hooks/useImageLoader';

export default function CoverControls({ state, dispatch, layouts, onUpload }) {
  const currentBg = BACKGROUNDS.find((b) => b.id === state.backgroundId) || BACKGROUNDS[0];
  const currentLayout = layouts.find((l) => l.id === state.layoutId) || layouts[0];
  const backgroundImg = useImageLoader(currentBg.path);

  function handleExport() {
    if (!backgroundImg) return;
    document.fonts.ready.then(() => {
      exportComposition({
        backgroundImg,
        screenshotImg: state.screenshot,
        layout: currentLayout,
        scale: state.resolution,
        mode: 'cover',
        title: state.title,
        date: state.date,
      });
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Screenshot</label>
        <DropZone onUpload={onUpload} hasImage={!!state.screenshot} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Background</label>
        <select
          value={state.backgroundId}
          onChange={(e) => dispatch({ type: 'SET_BACKGROUND', payload: e.target.value })}
          className="field-select w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          {BACKGROUNDS.map((bg) => (
            <option key={bg.id} value={bg.id}>{bg.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Layout</label>
        <select
          value={state.layoutId}
          onChange={(e) => dispatch({ type: 'SET_LAYOUT', payload: e.target.value })}
          className="field-select w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          {layouts.map((l) => (
            <option key={l.id} value={l.id}>{l.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Title</label>
        <input
          type="text"
          value={state.title}
          onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })}
          maxLength={45}
          placeholder="ie. The Fastest Path from Inbox to Insights"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">45 characters max</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Date</label>
        <input
          type="date"
          value={state.date}
          onChange={(e) => dispatch({ type: 'SET_DATE', payload: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Resolution</label>
        <select
          value={state.resolution}
          onChange={(e) => dispatch({ type: 'SET_RESOLUTION', payload: Number(e.target.value) })}
          className="field-select w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={3}>3x</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleExport}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Export
        </button>
      </div>
    </div>
  );
}
