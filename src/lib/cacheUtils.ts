/**
 * Enhanced caching utilities for optimized data and image handling
 * Reduces egress by implementing smart caching strategies
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  etag?: string;
}

interface ImagePreloadOptions {
  priority?: 'high' | 'low';
  sizes?: string;
  formats?: string[];
}

/**
 * Enhanced localStorage cache with TTL and versioning
 */
export class PersistentCache {
  private prefix = 'woolwitch_cache_';
  private version = '1.0';

  /**
   * Set cache item with TTL
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): boolean {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      
      const cacheKey = `${this.prefix}${this.version}_${key}`;
      localStorage.setItem(cacheKey, JSON.stringify(item));
      return true;
    } catch (error) {
      // Handle quota exceeded or other storage errors
      console.warn('Failed to set cache item:', error);
      this.cleanup();
      return false;
    }
  }

  /**
   * Get cache item if valid
   */
  get<T>(key: string): T | null {
    try {
      const cacheKey = `${this.prefix}${this.version}_${key}`;
      const stored = localStorage.getItem(cacheKey);
      
      if (!stored) return null;
      
      const item: CacheItem<T> = JSON.parse(stored);
      const now = Date.now();
      
      // Check if expired
      if (now > item.timestamp + item.ttl) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.warn('Failed to get cache item:', error);
      return null;
    }
  }

  /**
   * Remove specific cache item
   */
  remove(key: string): boolean {
    try {
      const cacheKey = `${this.prefix}${this.version}_${key}`;
      localStorage.removeItem(cacheKey);
      return true;
    } catch (error) {
      console.warn('Failed to remove cache item:', error);
      return false;
    }
  }

  /**
   * Clear expired items and manage storage quota
   */
  cleanup(): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(this.prefix));
      const now = Date.now();
      
      for (const key of cacheKeys) {
        try {
          const stored = localStorage.getItem(key);
          if (!stored) continue;
          
          const item: CacheItem<any> = JSON.parse(stored);
          
          // Remove if expired
          if (now > item.timestamp + item.ttl) {
            localStorage.removeItem(key);
          }
        } catch {
          // Remove corrupted items
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }
  }

  /**
   * Clear all cache items
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(this.prefix));
      
      for (const key of cacheKeys) {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { count: number; size: string } {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(this.prefix));
      
      let totalSize = 0;
      for (const key of cacheKeys) {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += new Blob([item]).size;
        }
      }
      
      return {
        count: cacheKeys.length,
        size: this.formatBytes(totalSize)
      };
    } catch {
      return { count: 0, size: '0 B' };
    }
  }

  private formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }
}

/**
 * Image preloading service for better performance
 */
export class ImagePreloader {
  private preloadedImages = new Set<string>();
  private preloadQueue: { url: string; options: ImagePreloadOptions }[] = [];
  private isProcessing = false;

  /**
   * Preload a single image
   */
  preload(url: string, options: ImagePreloadOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.preloadedImages.has(url)) {
        resolve();
        return;
      }

      const img = new Image();
      
      img.onload = () => {
        this.preloadedImages.add(url);
        resolve();
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to preload image: ${url}`));
      };

      // Set loading attributes for optimization
      if (options.priority === 'high') {
        img.loading = 'eager';
        img.fetchPriority = 'high';
      } else {
        img.loading = 'lazy';
        img.fetchPriority = 'low';
      }

      img.src = url;
    });
  }

  /**
   * Preload multiple images with queue management
   */
  preloadBatch(urls: string[], options: ImagePreloadOptions = {}): void {
    for (const url of urls) {
      if (!this.preloadedImages.has(url)) {
        this.preloadQueue.push({ url, options });
      }
    }
    
    this.processQueue();
  }

  /**
   * Preload images for visible products
   */
  preloadProductImages(products: any[]): void {
    const imageUrls = products
      .filter(product => product.image_url)
      .map(product => product.image_url);
    
    // Preload first few images with high priority
    const priorityUrls = imageUrls.slice(0, 6);
    const lowPriorityUrls = imageUrls.slice(6);
    
    priorityUrls.forEach(url => 
      this.preloadQueue.push({ url, options: { priority: 'high' } })
    );
    
    lowPriorityUrls.forEach(url => 
      this.preloadQueue.push({ url, options: { priority: 'low' } })
    );
    
    this.processQueue();
  }

  /**
   * Process preload queue with concurrency control
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.preloadQueue.length === 0) return;
    
    this.isProcessing = true;
    const concurrency = 3; // Limit concurrent preloads
    
    while (this.preloadQueue.length > 0) {
      const batch = this.preloadQueue.splice(0, concurrency);
      
      await Promise.allSettled(
        batch.map(({ url, options }) => this.preload(url, options))
      );
    }
    
    this.isProcessing = false;
  }

  /**
   * Clear preloaded images cache
   */
  clear(): void {
    this.preloadedImages.clear();
    this.preloadQueue = [];
  }

  /**
   * Check if image is preloaded
   */
  isPreloaded(url: string): boolean {
    return this.preloadedImages.has(url);
  }

  /**
   * Get preloader statistics
   */
  getStats(): { preloaded: number; queued: number } {
    return {
      preloaded: this.preloadedImages.size,
      queued: this.preloadQueue.length
    };
  }
}

/**
 * Network-aware loading strategy
 */
export class NetworkOptimizer {
  private connection = (navigator as any).connection;

  /**
   * Get optimal image quality based on connection
   */
  getOptimalQuality(): number {
    if (!this.connection) return 80;
    
    const effectiveType = this.connection.effectiveType;
    
    switch (effectiveType) {
      case '4g':
        return 85;
      case '3g':
        return 70;
      case '2g':
        return 50;
      case 'slow-2g':
        return 40;
      default:
        return 80;
    }
  }

  /**
   * Check if high-quality assets should be loaded
   */
  shouldLoadHighQuality(): boolean {
    if (!this.connection) return true;
    
    const { effectiveType, saveData } = this.connection;
    
    // Respect user's data saving preference
    if (saveData) return false;
    
    // Only load high quality on good connections
    return effectiveType === '4g';
  }

  /**
   * Get optimal batch size for requests
   */
  getOptimalBatchSize(): number {
    if (!this.connection) return 10;
    
    const effectiveType = this.connection.effectiveType;
    
    switch (effectiveType) {
      case '4g':
        return 15;
      case '3g':
        return 8;
      case '2g':
        return 5;
      case 'slow-2g':
        return 3;
      default:
        return 10;
    }
  }
}

// Export singleton instances
export const persistentCache = new PersistentCache();
export const imagePreloader = new ImagePreloader();
export const networkOptimizer = new NetworkOptimizer();

// Automatic cleanup on page load
persistentCache.cleanup();