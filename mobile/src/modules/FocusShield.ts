import { NativeModules, Platform } from 'react-native';

const { FocusShieldModule } = NativeModules;

export interface FocusShieldConfig {
  blockAllApps?: boolean;
  allowedApps?: string[]; // Bundle IDs
  blockedApps?: string[]; // Bundle IDs
}

export interface AuthorizationStatus {
  status: 'notDetermined' | 'denied' | 'approved' | 'unknown';
}

class FocusShield {
  /**
   * Check if Focus Shield is available on this device
   */
  isAvailable(): boolean {
    return Platform.OS === 'ios' && FocusShieldModule != null;
  }

  /**
   * Request Screen Time API authorization from the user
   */
  async requestAuthorization(): Promise<{ authorized: boolean }> {
    if (!this.isAvailable()) {
      throw new Error('Focus Shield is only available on iOS with native modules');
    }
    return FocusShieldModule.requestAuthorization();
  }

  /**
   * Check the current authorization status
   */
  async checkAuthorizationStatus(): Promise<AuthorizationStatus> {
    if (!this.isAvailable()) {
      return { status: 'denied' };
    }
    return FocusShieldModule.checkAuthorizationStatus();
  }

  /**
   * Enable Focus Shield with the specified configuration
   *
   * @param config - Configuration for which apps to block/allow
   *
   * Examples:
   * - Block all apps except Safari and Messages:
   *   { blockAllApps: true, allowedApps: ['com.apple.mobilesafari', 'com.apple.MobileSMS'] }
   *
   * - Block specific apps:
   *   { blockedApps: ['com.instagram.Instagram', 'com.facebook.Facebook'] }
   */
  async enable(config: FocusShieldConfig): Promise<{ success: boolean }> {
    if (!this.isAvailable()) {
      throw new Error('Focus Shield is only available on iOS with native modules');
    }
    return FocusShieldModule.enableFocusShield(config);
  }

  /**
   * Disable Focus Shield and remove all app restrictions
   */
  async disable(): Promise<{ success: boolean }> {
    if (!this.isAvailable()) {
      throw new Error('Focus Shield is only available on iOS with native modules');
    }
    return FocusShieldModule.disableFocusShield();
  }

  /**
   * Present the native iOS app picker to let users select apps
   * This is a system UI provided by Apple
   */
  async presentAppPicker(): Promise<{ presented: boolean }> {
    if (!this.isAvailable()) {
      throw new Error('Focus Shield is only available on iOS with native modules');
    }
    return FocusShieldModule.presentAppPicker();
  }

  /**
   * Schedule device activity monitoring
   * This enables tracking of app usage during Focus Shield sessions
   */
  async scheduleMonitoring(config: Record<string, any>): Promise<{ success: boolean; activityName: string }> {
    if (!this.isAvailable()) {
      throw new Error('Focus Shield is only available on iOS with native modules');
    }
    return FocusShieldModule.scheduleActivityMonitoring(config);
  }

  /**
   * Stop device activity monitoring
   */
  async stopMonitoring(): Promise<{ success: boolean }> {
    if (!this.isAvailable()) {
      throw new Error('Focus Shield is only available on iOS with native modules');
    }
    return FocusShieldModule.stopActivityMonitoring();
  }
}

export default new FocusShield();
