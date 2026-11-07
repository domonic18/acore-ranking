import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Providers } from './providers';
import { IframeHeightReporter } from '@/shared/components/IframeHeightReporter';
import { EmbedProvider } from '@/shared/components/EmbedProvider';
import '../styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      {/* 被门户 iframe 嵌入时上报内容高度,父页据此撑高 iframe(顶层打开时无副作用) */}
      <IframeHeightReporter>
        {/* 被门户 iframe 嵌入时接收父页下发的可用高度,子页据此裁剪内容 */}
        <EmbedProvider>
          {/* 内容锚点:高度上报的量测对象。跨全部路由稳定存在(路由切换不换节点),
              不得带 min-height 或 flex 拉伸类——否则上报高度被视口高托底,永不低于当前框高 */}
          <div data-embed-content className="min-h-0">
            <RouterProvider router={router} />
          </div>
        </EmbedProvider>
      </IframeHeightReporter>
    </Providers>
  </React.StrictMode>,
);
