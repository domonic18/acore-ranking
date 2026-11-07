import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Providers } from './providers';
import { IframeHeightReporter } from '@/shared/components/IframeHeightReporter';
import '../styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      {/* 被门户 iframe 嵌入时上报内容高度,父页据此撑高 iframe(顶层打开时无副作用) */}
      <IframeHeightReporter>
        <RouterProvider router={router} />
      </IframeHeightReporter>
    </Providers>
  </React.StrictMode>,
);
