/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { MagazinePage, WeatherAtmosphere, TouchDesignerStudy } from './types';
import {
  fetchJohannesburgWeather,
  DEFAULT_NEUTRAL_ATMOSPHERE,
} from './services/weatherService';
import { getSavedItems } from './services/bookmarkService';
import { TOUCHDESIGNER_STUDIES } from './data/studies';
import { Header } from './components/Header';
import { AetherLogo } from './components/AetherLogo';
import { CoverView } from './components/CoverView';
import { FeatureView } from './components/FeatureView';
import { IssuesView } from './components/IssuesView';
import { CreatorsView } from './components/CreatorsView';
import { StudyDetailModal } from './components/StudyDetailModal';
import { SubmitWorkModal } from './components/SubmitWorkModal';
import { AtmosphereSimulatorModal } from './components/AtmosphereSimulatorModal';
import { SavedDrawer } from './components/SavedDrawer';
import { MobileMenuDrawer } from './components/MobileMenuDrawer';
import { ResearchDossierModal } from './components/ResearchDossierModal';
import {
  IssuesArchiveModal,
  CreatorsDirectoryModal,
  AboutModal,
} from './components/DrawerModals';

const VALID_PAGES: MagazinePage[] = ['cover', 'feature', 'issues', 'creators'];

function readInitialPageFromHash(): MagazinePage {
  if (typeof window === 'undefined') return 'cover';
  const raw = window.location.hash.replace('#', '') as MagazinePage;
  return VALID_PAGES.includes(raw) ? raw : 'cover';
}

export default function App() {
  const [currentView, setCurrentView] = useState<MagazinePage>(readInitialPageFromHash);
  const [atmosphere, setAtmosphere] = useState<WeatherAtmosphere>(DEFAULT_NEUTRAL_ATMOSPHERE);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);
  const [weatherStatusLabel, setWeatherStatusLabel] = useState<string>('Reading Johannesburg skies...');

  // Modals & Panels
  const [selectedStudy, setSelectedStudy] = useState<TouchDesignerStudy | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isIssuesOpen, setIsIssuesOpen] = useState<boolean>(false);
  const [isCreatorsOpen, setIsCreatorsOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState<boolean>(false);

  // Saved studies reactive count
  const [savedCount, setSavedCount] = useState<number>(() => getSavedItems().length);

  // Initial Branded Magazine Loader
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoaderFading, setIsLoaderFading] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  // Load weather and animate branded entrance loader
  useEffect(() => {
    let progress = 0;
    let fadeTimeout: ReturnType<typeof setTimeout> | undefined;
    let unmountTimeout: ReturnType<typeof setTimeout> | undefined;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 22) + 20;
      if (progress >= 100) {
        progress = 100;
        setLoadingProgress(100);
        clearInterval(interval);
        fadeTimeout = setTimeout(() => {
          setIsLoaderFading(true);
          unmountTimeout = setTimeout(() => setIsInitialLoading(false), 450);
        }, 180);
      } else {
        setLoadingProgress(progress);
      }
    }, 65);

    const loadWeather = async () => {
      try {
        setWeatherStatusLabel('Reading Johannesburg skies...');
        const data = await fetchJohannesburgWeather();
        setAtmosphere(data);
        setWeatherStatusLabel(data.conditionLabel);
      } catch {
        setAtmosphere(DEFAULT_NEUTRAL_ATMOSPHERE);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    loadWeather();

    // Auto-refresh weather every 15 minutes
    const weatherTimer = setInterval(loadWeather, 15 * 60 * 1000);

    // Subscribe to saved studies changes
    const handleSavedUpdated = () => {
      setSavedCount(getSavedItems().length);
    };
    window.addEventListener('aetherside_saved_updated', handleSavedUpdated);

    return () => {
      clearInterval(interval);
      if (fadeTimeout) clearTimeout(fadeTimeout);
      if (unmountTimeout) clearTimeout(unmountTimeout);
      clearInterval(weatherTimer);
      window.removeEventListener('aetherside_saved_updated', handleSavedUpdated);
    };
  }, []);

  const handleManualWeatherRefresh = useCallback(async () => {
    setIsLoadingWeather(true);
    try {
      const data = await fetchJohannesburgWeather();
      setAtmosphere(data);
    } catch {
      // keep existing
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const next = readInitialPageFromHash();
      setCurrentView(next);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigate = (view: MagazinePage) => {
    if (view === currentView) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      const targetHash = view === 'cover' ? '#cover' : `#${view}`;
      if (window.location.hash !== targetHash) {
        window.history.replaceState(null, '', targetHash);
      }
    }
  };

  const handleOpenIssuesPage = () => {
    setIsIssuesOpen(false);
    handleNavigate('issues');
  };

  const handleOpenCreatorsPage = () => {
    setIsCreatorsOpen(false);
    handleNavigate('creators');
  };

  const handleOpenStudyById = (id: string) => {
    const found = TOUCHDESIGNER_STUDIES.find((s) => s.id === id);
    if (found) {
      setSelectedStudy(found);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#09090b] font-sans antialiased selection:bg-purple-200 selection:text-black flex flex-col">
      {/* Initial Editorial Reveal */}
      {isInitialLoading && (
        <div
          className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 transition-opacity duration-450 ease-out ${
            isLoaderFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="w-full max-w-sm text-center space-y-6">
            <div className="flex justify-center">
              <AetherLogo size="xl" />
            </div>

            <div className="text-[11px] font-mono-custom uppercase tracking-widest text-zinc-600">
              Work, beyond the feed.
            </div>

            <div className="space-y-2">
              <div className="w-full h-px bg-zinc-200 overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-150 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono-custom text-zinc-500">
                <span>{weatherStatusLabel}</span>
                <span className="tabular-nums text-black font-medium">{loadingProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Magazine Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenIssues={handleOpenIssuesPage}
        onOpenCreators={handleOpenCreatorsPage}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenSubmit={() => setIsSubmitModalOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenResearch={() => setIsResearchModalOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        savedCount={savedCount}
        atmosphere={atmosphere}
      />

      {/* Main Magazine Pages (4 Standalone Full Pages) */}
      <main className="flex-1">
        {currentView === 'cover' && (
          <CoverView
            atmosphere={atmosphere}
            onEnterFeature={() => handleNavigate('feature')}
            onOpenStudy={(study) => setSelectedStudy(study)}
            onOpenSubmit={() => setIsSubmitModalOpen(true)}
            onOpenIssues={handleOpenIssuesPage}
            onOpenCreators={handleOpenCreatorsPage}
            onOpenAbout={() => setIsAboutOpen(true)}
            onOpenResearch={() => setIsResearchModalOpen(true)}
          />
        )}

        {currentView === 'feature' && (
          <FeatureView
            atmosphere={atmosphere}
            onBackToCover={() => handleNavigate('cover')}
            onOpenStudy={(study) => setSelectedStudy(study)}
            onOpenSubmit={() => setIsSubmitModalOpen(true)}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onOpenResearch={() => setIsResearchModalOpen(true)}
          />
        )}

        {currentView === 'issues' && (
          <IssuesView
            onNavigate={handleNavigate}
            onOpenStudy={(study) => setSelectedStudy(study)}
            onOpenSubmit={() => setIsSubmitModalOpen(true)}
            onOpenResearch={() => setIsResearchModalOpen(true)}
          />
        )}

        {currentView === 'creators' && (
          <CreatorsView
            onNavigate={handleNavigate}
            onOpenStudy={(study) => setSelectedStudy(study)}
            onOpenSubmit={() => setIsSubmitModalOpen(true)}
            onOpenResearch={() => setIsResearchModalOpen(true)}
          />
        )}
      </main>

      {/* 1. TouchDesigner Study Inspector Modal */}
      <StudyDetailModal
        study={selectedStudy}
        onClose={() => setSelectedStudy(null)}
      />

      {/* 2. Creator Project Proposal Modal */}
      <SubmitWorkModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />

      {/* 3. Open-Meteo Atmosphere Simulator Modal */}
      <AtmosphereSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        atmosphere={atmosphere}
        onApplyAtmosphere={(updated) => setAtmosphere(updated)}
        onResetToLive={handleManualWeatherRefresh}
        isLoadingLive={isLoadingWeather}
      />

      {/* 4. Issue Archive Modal */}
      <IssuesArchiveModal
        isOpen={isIssuesOpen}
        onClose={() => setIsIssuesOpen(false)}
        onSelectFeature={() => handleNavigate('feature')}
        onOpenSubmit={() => setIsSubmitModalOpen(true)}
        onOpen3DBookshelf={handleOpenIssuesPage}
      />

      {/* 5. Creator Directory Modal */}
      <CreatorsDirectoryModal
        isOpen={isCreatorsOpen}
        onClose={() => setIsCreatorsOpen(false)}
      />

      {/* 6. Curatorial About / Mission Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenSubmit={() => setIsSubmitModalOpen(true)}
      />

      {/* 7. Studio Reading List & Saved Studies Drawer */}
      <SavedDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        onOpenStudyById={handleOpenStudyById}
        onEnterFeature={() => handleNavigate('feature')}
      />

      {/* 8. Responsive Mobile Navigation Drawer */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenIssues={handleOpenIssuesPage}
        onOpenCreators={handleOpenCreatorsPage}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenSubmit={() => setIsSubmitModalOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenResearch={() => setIsResearchModalOpen(true)}
        savedCount={savedCount}
        atmosphere={atmosphere}
      />

      {/* 9. Comprehensive Research & PRD Dossier Modal */}
      <ResearchDossierModal
        isOpen={isResearchModalOpen}
        onClose={() => setIsResearchModalOpen(false)}
      />
    </div>
  );
}
