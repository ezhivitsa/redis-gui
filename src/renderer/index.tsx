import { createRoot } from 'react-dom/client';

import { App } from 'renderer/scenes/app';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
