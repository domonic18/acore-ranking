import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import App from './App';

const LoadingState = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="text-muted-foreground">Loading...</div>
  </div>
);

const OnlinePage = lazy(() => import('@/pages/OnlinePage'));
const RankingPage = lazy(() => import('@/pages/RankingPage'));
const HardcorePage = lazy(() => import('@/pages/HardcorePage'));
const AchievementPage = lazy(() => import('@/pages/AchievementPage'));
const BanlistPage = lazy(() => import('@/pages/BanlistPage'));
const CharacterPage = lazy(() => import('@/pages/CharacterPage'));
const OnlineWidgetPage = lazy(() => import('@/pages/OnlineWidgetPage'));
const PlayerMapPage = lazy(() => import('@/pages/PlayerMapPage'));
const EncounterPage = lazy(() => import('@/pages/EncounterPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/ranking" replace /> },
      {
        path: 'online',
        element: (
          <Suspense fallback={<LoadingState />}>
            <OnlinePage />
          </Suspense>
        ),
      },
      {
        path: 'ranking',
        element: (
          <Suspense fallback={<LoadingState />}>
            <RankingPage />
          </Suspense>
        ),
      },
      {
        path: 'hardcore',
        element: (
          <Suspense fallback={<LoadingState />}>
            <HardcorePage />
          </Suspense>
        ),
      },
      {
        path: 'character/:name',
        element: (
          <Suspense fallback={<LoadingState />}>
            <CharacterPage />
          </Suspense>
        ),
      },
      {
        path: 'encounter',
        element: (
          <Suspense fallback={<LoadingState />}>
            <EncounterPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/achievement',
    element: (
      <Suspense fallback={<LoadingState />}>
        <AchievementPage />
      </Suspense>
    ),
  },
  {
    path: '/banlist',
    element: (
      <Suspense fallback={<LoadingState />}>
        <BanlistPage />
      </Suspense>
    ),
  },
  {
    path: '/widget/online',
    element: (
      <Suspense fallback={<LoadingState />}>
        <OnlineWidgetPage />
      </Suspense>
    ),
  },
  {
    path: '/playermap',
    element: (
      <Suspense fallback={<LoadingState />}>
        <PlayerMapPage />
      </Suspense>
    ),
  },
]);
