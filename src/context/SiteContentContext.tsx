import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteContentSlot, CustomSection, MediaLibraryItem, AuditLogEntry } from '../types';
import { adminClientStorage } from '../services/adminClientStorage';

interface SiteContentContextType {
  slots: SiteContentSlot[];
  customSections: CustomSection[];
  mediaLibrary: MediaLibraryItem[];
  auditLogs: AuditLogEntry[];
  lastPublished: string;
  hasUnpublished: boolean;
  isLoading: boolean;
  getSlot: (
    key: string,
    fallbackUrl?: string,
    fallbackAlt?: string
  ) => {
    imageUrl: string;
    altText: string;
    aspectRatio: string;
    fit: 'cover' | 'contain';
    position: 'center' | 'top' | 'bottom';
  };
  getCustomSectionsForPage: (page: string) => CustomSection[];
  updateSlot: (key: string, updates: Partial<SiteContentSlot>) => Promise<boolean>;
  saveDrafts: () => Promise<boolean>;
  publishChanges: () => Promise<boolean>;
  revertDrafts: () => Promise<boolean>;
  saveCustomSection: (data: Partial<CustomSection> & { id?: string }) => Promise<boolean>;
  deleteCustomSection: (id: string) => Promise<boolean>;
  uploadMedia: (data: {
    name: string;
    url: string;
    category?: string;
    aspectRatio?: string;
    size?: string;
    origin?: string;
  }) => Promise<boolean>;
  deleteMedia: (id: string) => Promise<boolean>;
  refreshContent: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

function getAuthHeaders(): HeadersInit {
  const token =
    (typeof window !== 'undefined' &&
      (localStorage.getItem('oralpro_admin_token') || sessionStorage.getItem('oralpro_admin_token'))) ||
    '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [slots, setSlots] = useState<SiteContentSlot[]>([]);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [mediaLibrary, setMediaLibrary] = useState<MediaLibraryItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [lastPublished, setLastPublished] = useState<string>('');
  const [hasUnpublished, setHasUnpublished] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshContent = useCallback(async () => {
    try {
      const res = await fetch('/api/site-content');
      if (res.ok) {
        const text = await res.text();
        if (text && !text.trim().startsWith('<')) {
          const data = JSON.parse(text);
          if (data && data.success && data.data) {
            setSlots(data.data.slots || []);
            setCustomSections(data.data.customSections || []);
            setMediaLibrary(data.data.mediaLibrary || []);
            setAuditLogs(data.data.auditLogs || []);
            setLastPublished(data.data.lastPublished || '');
            setHasUnpublished(Boolean(data.data.hasUnpublished));
            setIsLoading(false);
            return;
          }
        }
      }
    } catch {
      // Fallback below
    }
    // Netlify / local fallback
    const local = adminClientStorage.getSiteContent();
    setSlots(local.slots || []);
    setCustomSections(local.customSections || []);
    setMediaLibrary(local.mediaLibrary || []);
    setAuditLogs(local.auditLogs || []);
    setLastPublished(local.lastPublished || '');
    setHasUnpublished(Boolean(local.hasUnpublished));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  const getSlot = useCallback(
    (key: string, fallbackUrl = '', fallbackAlt = '') => {
      const slot = slots.find((s) => s.key === key);
      if (!slot) {
        return {
          imageUrl: fallbackUrl,
          altText: fallbackAlt,
          aspectRatio: '16:9',
          fit: 'cover' as const,
          position: 'center' as const,
        };
      }
      return {
        imageUrl: slot.imageUrl || fallbackUrl,
        altText: slot.altText || fallbackAlt,
        aspectRatio: slot.aspectRatio || '16:9',
        fit: slot.fit || 'cover',
        position: slot.position || 'center',
      };
    },
    [slots]
  );

  const getCustomSectionsForPage = useCallback(
    (page: string) => {
      return customSections
        .filter((sec) => sec.page === page && sec.status === 'publicado')
        .sort((a, b) => a.order - b.order);
    },
    [customSections]
  );

  const updateSlot = async (key: string, updates: Partial<SiteContentSlot>): Promise<boolean> => {
    try {
      const res = await fetch('/api/site-content/slot', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ key, updates }),
      });
      const text = await res.text();
      if (text && !text.trim().startsWith('<')) {
        const json = JSON.parse(text);
        if (json.success) {
          await refreshContent();
          return true;
        }
      }
      throw new Error('Local update');
    } catch {
      const ok = adminClientStorage.updateSlot(key, updates);
      await refreshContent();
      return ok;
    }
  };

  const saveDrafts = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/site-content/save-drafts', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const text = await res.text();
      if (text && !text.trim().startsWith('<')) {
        const json = JSON.parse(text);
        if (json.success) {
          await refreshContent();
          return true;
        }
      }
    } catch {
      // Local fallback
    }
    await refreshContent();
    return true;
  };

  const publishChanges = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/site-content/publish', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const text = await res.text();
      if (text && !text.trim().startsWith('<')) {
        const json = JSON.parse(text);
        if (json.success) {
          await refreshContent();
          return true;
        }
      }
      throw new Error('Local publish');
    } catch {
      const ok = adminClientStorage.publishSiteContent();
      await refreshContent();
      return ok;
    }
  };

  const revertDrafts = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/site-content/revert', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const text = await res.text();
      if (text && !text.trim().startsWith('<')) {
        const json = JSON.parse(text);
        if (json.success) {
          await refreshContent();
          return true;
        }
      }
    } catch {
      // ignore
    }
    await refreshContent();
    return true;
  };

  const saveCustomSection = async (
    data: Partial<CustomSection> & { id?: string }
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/site-content/custom-section', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const text = await res.text();
      if (text && !text.trim().startsWith('<')) {
        const json = JSON.parse(text);
        if (json.success) {
          await refreshContent();
          return true;
        }
      }
      throw new Error('Local custom section');
    } catch {
      const ok = adminClientStorage.saveCustomSection(data);
      await refreshContent();
      return ok;
    }
  };

  const deleteCustomSection = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/site-content/custom-section/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const text = await res.text();
      if (text && !text.trim().startsWith('<')) {
        const json = JSON.parse(text);
        if (json.success) {
          await refreshContent();
          return true;
        }
      }
      throw new Error('Local delete section');
    } catch {
      const ok = adminClientStorage.deleteCustomSection(id);
      await refreshContent();
      return ok;
    }
  };

  const uploadMedia = async (data: {
    name: string;
    url: string;
    category?: string;
    aspectRatio?: string;
    size?: string;
    origin?: string;
  }) => {
    try {
      const res = await fetch('/api/site-content/media-library', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const text = await res.text();
      if (text && !text.trim().startsWith('<')) {
        const json = JSON.parse(text);
        if (json.success) {
          await refreshContent();
          return true;
        }
      }
      throw new Error('Local media');
    } catch {
      adminClientStorage.addMedia({
        ...data,
        usedIn: [],
      });
      await refreshContent();
      return true;
    }
  };

  const deleteMedia = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/site-content/media-library/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const text = await res.text();
      if (text && !text.trim().startsWith('<')) {
        const json = JSON.parse(text);
        if (json.success) {
          await refreshContent();
          return true;
        }
      }
      throw new Error('Local delete media');
    } catch {
      const ok = adminClientStorage.deleteMedia(id);
      await refreshContent();
      return ok;
    }
  };

  return (
    <SiteContentContext.Provider
      value={{
        slots,
        customSections,
        mediaLibrary,
        auditLogs,
        lastPublished,
        hasUnpublished,
        isLoading,
        getSlot,
        getCustomSectionsForPage,
        updateSlot,
        saveDrafts,
        publishChanges,
        revertDrafts,
        saveCustomSection,
        deleteCustomSection,
        uploadMedia,
        deleteMedia,
        refreshContent,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
