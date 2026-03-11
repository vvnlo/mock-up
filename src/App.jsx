import { useReducer, useCallback } from 'react';
import TabSwitcher from './components/TabSwitcher';
import ImageControls from './components/ImageControls';
import CoverControls from './components/CoverControls';
import PreviewCanvas from './components/PreviewCanvas';
import { IMAGE_LAYOUTS, COVER_LAYOUTS } from './lib/layouts';
import { BACKGROUNDS } from './lib/backgrounds';

const initialState = {
  mode: 'image',
  screenshot: null,
  screenshotFile: null,
  backgroundId: 'bg-1',
  layoutId: 'img-1',
  resolution: 1,
  title: '',
  date: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_MODE': {
      const isImage = action.payload === 'image';
      return {
        ...initialState,
        mode: action.payload,
        layoutId: isImage ? 'img-1' : 'cover-16-9',
      };
    }
    case 'SET_SCREENSHOT':
      return { ...state, screenshot: action.payload.img, screenshotFile: action.payload.file };
    case 'SET_BACKGROUND':
      return { ...state, backgroundId: action.payload };
    case 'SET_LAYOUT':
      return { ...state, layoutId: action.payload };
    case 'SET_RESOLUTION':
      return { ...state, resolution: action.payload };
    case 'SET_TITLE':
      return { ...state, title: action.payload };
    case 'SET_DATE':
      return { ...state, date: action.payload };
    case 'RESET': {
      const isImage = state.mode === 'image';
      return {
        ...initialState,
        mode: state.mode,
        layoutId: isImage ? 'img-1' : 'cover-16-9',
      };
    }
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const layouts = state.mode === 'image' ? IMAGE_LAYOUTS : COVER_LAYOUTS;
  const currentLayout = layouts.find((l) => l.id === state.layoutId) || layouts[0];
  const currentBg = BACKGROUNDS.find((b) => b.id === state.backgroundId) || BACKGROUNDS[0];

  const handleUpload = useCallback((img, file) => {
    dispatch({ type: 'SET_SCREENSHOT', payload: { img, file } });
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="flex justify-center py-4 border-b border-gray-200">
        <TabSwitcher mode={state.mode} onChange={(m) => dispatch({ type: 'SET_MODE', payload: m })} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 shrink-0 border-r border-gray-200 overflow-y-auto p-6">
          {state.mode === 'image' ? (
            <ImageControls
              state={state}
              dispatch={dispatch}
              layouts={layouts}
              onUpload={handleUpload}
            />
          ) : (
            <CoverControls
              state={state}
              dispatch={dispatch}
              layouts={layouts}
              onUpload={handleUpload}
            />
          )}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-4 pb-2">
            <span className="text-sm font-medium text-gray-500">Preview output</span>
          </div>
          <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
            <PreviewCanvas
              mode={state.mode}
              screenshot={state.screenshot}
              backgroundPath={currentBg.path}
              layout={currentLayout}
              resolution={state.resolution}
              title={state.title}
              date={state.date}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
