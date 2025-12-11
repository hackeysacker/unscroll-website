import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

// Types for face tracking data
export interface FaceTrackingData {
  isFacePresent: boolean;
  faceCenterX: number;
  faceCenterY: number;
  faceDistance: number;
  gazeDirection: 'centered' | 'left' | 'right' | 'up' | 'down' | 'unknown';
  attentionScore: number;
  isTracking: boolean;
  trackingMode: 'arkit' | 'vision' | 'none';
}

export interface StartTrackingResult {
  success: boolean;
  trackingMode: 'arkit' | 'vision';
}

// Native module interface
interface FaceTrackingModuleInterface {
  requestPermission(): Promise<boolean>;
  startTracking(): Promise<StartTrackingResult | boolean>;
  stopTracking(): Promise<boolean>;
  getTrackingData(): Promise<FaceTrackingData>;
  isSupported(): Promise<boolean>;
  isARKitSupported(): Promise<boolean>;
  getTrackingMode(): Promise<string>;
}

// Get native module (iOS only for now)
const FaceTrackingNative = Platform.OS === 'ios'
  ? NativeModules.FaceTrackingModule as FaceTrackingModuleInterface
  : null;

// Event emitter for tracking updates
const eventEmitter = FaceTrackingNative
  ? new NativeEventEmitter(NativeModules.FaceTrackingModule)
  : null;

// Subscription type
type Subscription = { remove: () => void };

/**
 * Face Tracking API
 * Provides face detection and attention tracking using device camera
 * 
 * On iPhone X+ (TrueDepth camera): Uses ARKit for precise gaze tracking
 * On older iPhones: Uses Vision framework for basic face detection
 */
export const FaceTracking = {
  /**
   * Check if face tracking is supported on this device
   * Returns true for any iOS device with a front camera
   */
  async isSupported(): Promise<boolean> {
    if (!FaceTrackingNative) return false;
    try {
      return await FaceTrackingNative.isSupported();
    } catch {
      return false;
    }
  },

  /**
   * Check if ARKit TrueDepth face tracking is available
   * This provides more accurate gaze direction detection
   */
  async isARKitSupported(): Promise<boolean> {
    if (!FaceTrackingNative) return false;
    try {
      return await FaceTrackingNative.isARKitSupported();
    } catch {
      return false;
    }
  },

  /**
   * Request camera permission for face tracking
   */
  async requestPermission(): Promise<boolean> {
    if (!FaceTrackingNative) return false;
    return FaceTrackingNative.requestPermission();
  },

  /**
   * Start face tracking session
   * Automatically selects best available tracking method:
   * - ARKit on iPhone X+ (TrueDepth camera)
   * - Vision framework on older devices
   */
  async startTracking(): Promise<{ success: boolean; trackingMode: string }> {
    if (!FaceTrackingNative) return { success: false, trackingMode: 'none' };
    try {
      const result = await FaceTrackingNative.startTracking();
      if (typeof result === 'boolean') {
        // Legacy response
        return { success: result, trackingMode: 'arkit' };
      }
      return { success: result.success, trackingMode: result.trackingMode };
    } catch (error) {
      console.error('Start tracking error:', error);
      return { success: false, trackingMode: 'none' };
    }
  },

  /**
   * Stop face tracking session
   */
  async stopTracking(): Promise<boolean> {
    if (!FaceTrackingNative) return false;
    return FaceTrackingNative.stopTracking();
  },

  /**
   * Get current tracking data
   */
  async getTrackingData(): Promise<FaceTrackingData | null> {
    if (!FaceTrackingNative) return null;
    return FaceTrackingNative.getTrackingData();
  },

  /**
   * Get current tracking mode
   */
  async getTrackingMode(): Promise<'arkit' | 'vision' | 'none'> {
    if (!FaceTrackingNative) return 'none';
    try {
      const mode = await FaceTrackingNative.getTrackingMode();
      return mode as 'arkit' | 'vision' | 'none';
    } catch {
      return 'none';
    }
  },

  /**
   * Subscribe to tracking updates
   * @param callback Function called with tracking data ~15fps
   * @returns Subscription to remove when done
   */
  onTrackingUpdate(callback: (data: FaceTrackingData) => void): Subscription {
    if (!eventEmitter) {
      return { remove: () => {} };
    }
    const subscription = eventEmitter.addListener('onFaceTrackingUpdate', callback);
    return subscription;
  },

  /**
   * Subscribe to attention level changes
   * @param callback Function called when attention is very high or low
   * @returns Subscription to remove when done
   */
  onAttentionChange(callback: (data: { attentionScore: number; isHighAttention: boolean }) => void): Subscription {
    if (!eventEmitter) {
      return { remove: () => {} };
    }
    const subscription = eventEmitter.addListener('onAttentionChange', callback);
    return subscription;
  },
};

/**
 * Mock face tracking for Android/development
 * Returns simulated data for testing
 */
export const MockFaceTracking = {
  private: {
    isTracking: false,
    intervalId: null as NodeJS.Timeout | null,
    trackingMode: 'vision' as 'arkit' | 'vision' | 'none',
  },

  async isSupported(): Promise<boolean> {
    return true;
  },

  async isARKitSupported(): Promise<boolean> {
    return false; // Mock doesn't have ARKit
  },

  async requestPermission(): Promise<boolean> {
    return true;
  },

  async startTracking(): Promise<{ success: boolean; trackingMode: string }> {
    this.private.isTracking = true;
    this.private.trackingMode = 'vision';
    return { success: true, trackingMode: 'vision' };
  },

  async stopTracking(): Promise<boolean> {
    this.private.isTracking = false;
    this.private.trackingMode = 'none';
    if (this.private.intervalId) {
      clearInterval(this.private.intervalId);
      this.private.intervalId = null;
    }
    return true;
  },

  async getTrackingData(): Promise<FaceTrackingData> {
    return {
      isFacePresent: true,
      faceCenterX: 0.5 + (Math.random() - 0.5) * 0.1,
      faceCenterY: 0.5 + (Math.random() - 0.5) * 0.1,
      faceDistance: 0.5,
      gazeDirection: 'centered',
      attentionScore: 0.8 + (Math.random() - 0.5) * 0.2,
      isTracking: this.private.isTracking,
      trackingMode: this.private.trackingMode,
    };
  },

  async getTrackingMode(): Promise<'arkit' | 'vision' | 'none'> {
    return this.private.trackingMode;
  },

  onTrackingUpdate(callback: (data: FaceTrackingData) => void): Subscription {
    this.private.intervalId = setInterval(async () => {
      if (this.private.isTracking) {
        const data = await this.getTrackingData();
        callback(data);
      }
    }, 66); // ~15fps

    return {
      remove: () => {
        if (this.private.intervalId) {
          clearInterval(this.private.intervalId);
          this.private.intervalId = null;
        }
      },
    };
  },

  onAttentionChange(callback: (data: { attentionScore: number; isHighAttention: boolean }) => void): Subscription {
    return { remove: () => {} };
  },
};

// Export the appropriate implementation
export const FaceTrackingAPI = Platform.OS === 'ios' ? FaceTracking : MockFaceTracking;
