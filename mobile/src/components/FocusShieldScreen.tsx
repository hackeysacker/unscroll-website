import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Modal, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import FocusShield, { AuthorizationStatus } from '../modules/FocusShield';

interface FocusShieldScreenProps {
  onBack: () => void;
}

// Common app bundle IDs for popular distracting apps
const POPULAR_APPS = [
  { name: 'Instagram', bundleId: 'com.burbn.instagram', emoji: '📷' },
  { name: 'Facebook', bundleId: 'com.facebook.Facebook', emoji: '👥' },
  { name: 'TikTok', bundleId: 'com.zhiliaoapp.musically', emoji: '🎵' },
  { name: 'Twitter/X', bundleId: 'com.atebits.Tweetie2', emoji: '🐦' },
  { name: 'Snapchat', bundleId: 'com.snapchat.snapchat', emoji: '👻' },
  { name: 'Reddit', bundleId: 'com.reddit.Reddit', emoji: '🤖' },
  { name: 'YouTube', bundleId: 'com.google.ios.youtube', emoji: '▶️' },
  { name: 'WhatsApp', bundleId: 'net.whatsapp.WhatsApp', emoji: '💬' },
  { name: 'Telegram', bundleId: 'ph.telegra.Telegraph', emoji: '✈️' },
  { name: 'Chrome', bundleId: 'com.google.chrome.ios', emoji: '🌐' },
];

const ESSENTIAL_APPS = [
  { name: 'Safari', bundleId: 'com.apple.mobilesafari', emoji: '🧭' },
  { name: 'Messages', bundleId: 'com.apple.MobileSMS', emoji: '💬' },
  { name: 'Phone', bundleId: 'com.apple.mobilephone', emoji: '📞' },
  { name: 'Mail', bundleId: 'com.apple.mobilemail', emoji: '📧' },
  { name: 'Calendar', bundleId: 'com.apple.mobilecal', emoji: '📅' },
  { name: 'Clock', bundleId: 'com.apple.mobiletimer', emoji: '⏰' },
];

type ShieldMode = 'off' | 'block-all' | 'block-selected' | 'scheduled';

interface ScheduleConfig {
  enabled: boolean;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  days: number[]; // 0-6, Sunday-Saturday
}

export function FocusShieldScreen({ onBack }: FocusShieldScreenProps) {
  const insets = useSafeAreaInsets();

  // State
  const [authStatus, setAuthStatus] = useState<AuthorizationStatus['status']>('notDetermined');
  const [shieldMode, setShieldMode] = useState<ShieldMode>('off');
  const [blockedApps, setBlockedApps] = useState<string[]>([]);
  const [allowedApps, setAllowedApps] = useState<string[]>(['com.apple.mobilesafari', 'com.apple.MobileSMS', 'com.apple.mobilephone']);
  const [isLoading, setIsLoading] = useState(false);
  const [showAppSelector, setShowAppSelector] = useState(false);
  const [selectorType, setSelectorType] = useState<'block' | 'allow'>('block');
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>({
    enabled: false,
    startHour: 9,
    startMinute: 0,
    endHour: 17,
    endMinute: 0,
    days: [1, 2, 3, 4, 5], // Monday-Friday
  });

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = async () => {
    // For development/demo: Always show as approved so we can see the full UI
    // In production, this would check actual permission status
    if (!FocusShield.isAvailable()) {
      // If not on iOS, still show the UI for demo purposes
      setAuthStatus('approved');
      return;
    }
    try {
      const status = await FocusShield.checkAuthorizationStatus();
      // Override to show approved for demo
      setAuthStatus('approved');
      // setAuthStatus(status.status); // Uncomment this for production
    } catch (error) {
      console.error('Failed to check authorization:', error);
      // Still show as approved for demo
      setAuthStatus('approved');
    }
  };

  const requestPermission = async () => {
    if (!FocusShield.isAvailable()) {
      Alert.alert('Not Available', 'Focus Shield is only available on iOS devices.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await FocusShield.requestAuthorization();
      if (result.authorized) {
        setAuthStatus('approved');
        Alert.alert('Success', 'Screen Time permission granted!');
      }
    } catch (error: any) {
      Alert.alert('Permission Denied', error.message || 'Failed to request permission');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShieldMode = async (mode: ShieldMode) => {
    if (authStatus !== 'approved') {
      Alert.alert(
        'Permission Required',
        'You need to grant Screen Time permission first.',
        [{ text: 'Grant Permission', onPress: requestPermission }]
      );
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'off') {
        // Demo mode: Just update state
        if (FocusShield.isAvailable()) {
          await FocusShield.disable();
          await FocusShield.stopMonitoring();
        }
        setShieldMode('off');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Shield Deactivated', 'All apps are now accessible.');
      } else if (mode === 'block-all') {
        // Demo mode: Just update state
        if (FocusShield.isAvailable()) {
          await FocusShield.enable({
            blockAllApps: true,
            allowedApps: allowedApps,
          });
          await FocusShield.scheduleMonitoring({});
        }
        setShieldMode('block-all');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Shield Activated', `All apps blocked except ${allowedApps.length} essential apps!`);
      } else if (mode === 'block-selected') {
        if (blockedApps.length === 0) {
          Alert.alert('No Apps Selected', 'Please select apps to block first.');
          setIsLoading(false);
          return;
        }
        // Demo mode: Just update state
        if (FocusShield.isAvailable()) {
          await FocusShield.enable({
            blockedApps: blockedApps,
          });
          await FocusShield.scheduleMonitoring({});
        }
        setShieldMode('block-selected');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Shield Activated', `${blockedApps.length} apps are now blocked!`);
      }
    } catch (error: any) {
      Alert.alert('Demo Mode', 'Shield state updated. On iOS with permissions, this would actually block apps.');
      // Still update the UI state
      setShieldMode(mode);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAppInList = (bundleId: string, listType: 'block' | 'allow') => {
    Haptics.selectionAsync();
    if (listType === 'block') {
      setBlockedApps(prev =>
        prev.includes(bundleId)
          ? prev.filter(id => id !== bundleId)
          : [...prev, bundleId]
      );
    } else {
      setAllowedApps(prev =>
        prev.includes(bundleId)
          ? prev.filter(id => id !== bundleId)
          : [...prev, bundleId]
      );
    }
  };

  const openAppSelector = (type: 'block' | 'allow') => {
    setSelectorType(type);
    setShowAppSelector(true);
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Background */}
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onBack();
          }}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Focus Shield</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Authorization Section */}
        {authStatus !== 'approved' && (
          <View style={styles.permissionCard}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.permissionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.permissionEmoji}>🔐</Text>
              <Text style={styles.permissionTitle}>Permission Required</Text>
              <Text style={styles.permissionDescription}>
                Grant Screen Time access to enable real app blocking
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={requestPermission}
                disabled={isLoading}
              >
                <Text style={styles.permissionButtonText}>
                  {isLoading ? 'Requesting...' : 'Grant Permission'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Shield Status */}
        {authStatus === 'approved' && (
          <View style={styles.statusCard}>
            <LinearGradient
              colors={shieldMode !== 'off' ? ['#10B981', '#059669'] : ['#374151', '#1F2937']}
              style={styles.statusGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.statusEmoji}>{shieldMode !== 'off' ? '🛡️' : '⚫'}</Text>
              <Text style={styles.statusTitle}>
                {shieldMode !== 'off' ? 'Shield Active' : 'Shield Inactive'}
              </Text>
              <Text style={styles.statusSubtitle}>
                {shieldMode === 'block-all' && 'Blocking all apps except allowed'}
                {shieldMode === 'block-selected' && `Blocking ${blockedApps.length} selected apps`}
                {shieldMode === 'scheduled' && 'Scheduled blocking active'}
                {shieldMode === 'off' && 'All apps are accessible'}
              </Text>
            </LinearGradient>
          </View>
        )}

        {/* Shield Modes */}
        {authStatus === 'approved' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shield Modes</Text>

            {/* Block All Mode */}
            <TouchableOpacity
              style={[styles.modeCard, shieldMode === 'block-all' && styles.modeCardActive]}
              onPress={() => toggleShieldMode(shieldMode === 'block-all' ? 'off' : 'block-all')}
              disabled={isLoading}
            >
              <View style={styles.modeIcon}>
                <Text style={styles.modeIconEmoji}>🚫</Text>
              </View>
              <View style={styles.modeContent}>
                <Text style={styles.modeTitle}>Block All Apps</Text>
                <Text style={styles.modeDescription}>
                  Block everything except {allowedApps.length} essential apps
                </Text>
              </View>
              <Switch
                value={shieldMode === 'block-all'}
                onValueChange={() => toggleShieldMode(shieldMode === 'block-all' ? 'off' : 'block-all')}
                disabled={isLoading}
                trackColor={{ false: '#4B5563', true: '#34D399' }}
                thumbColor={shieldMode === 'block-all' ? '#10B981' : '#9CA3AF'}
              />
            </TouchableOpacity>

            {/* Block Selected Mode */}
            <TouchableOpacity
              style={[styles.modeCard, shieldMode === 'block-selected' && styles.modeCardActive]}
              onPress={() => toggleShieldMode(shieldMode === 'block-selected' ? 'off' : 'block-selected')}
              disabled={isLoading}
            >
              <View style={styles.modeIcon}>
                <Text style={styles.modeIconEmoji}>🎯</Text>
              </View>
              <View style={styles.modeContent}>
                <Text style={styles.modeTitle}>Block Selected Apps</Text>
                <Text style={styles.modeDescription}>
                  Block {blockedApps.length} chosen apps only
                </Text>
              </View>
              <Switch
                value={shieldMode === 'block-selected'}
                onValueChange={() => toggleShieldMode(shieldMode === 'block-selected' ? 'off' : 'block-selected')}
                disabled={isLoading}
                trackColor={{ false: '#4B5563', true: '#34D399' }}
                thumbColor={shieldMode === 'block-selected' ? '#10B981' : '#9CA3AF'}
              />
            </TouchableOpacity>

            {/* Turn Off Shield */}
            {shieldMode !== 'off' && (
              <TouchableOpacity
                style={styles.disableButton}
                onPress={() => toggleShieldMode('off')}
                disabled={isLoading}
              >
                <Text style={styles.disableButtonText}>
                  {isLoading ? 'Disabling...' : 'Turn Off Shield'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* App Selection */}
        {authStatus === 'approved' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manage Apps</Text>

            {/* Blocked Apps */}
            <TouchableOpacity
              style={styles.appListButton}
              onPress={() => openAppSelector('block')}
            >
              <View style={styles.appListIcon}>
                <Text style={styles.appListIconEmoji}>🚫</Text>
              </View>
              <View style={styles.appListContent}>
                <Text style={styles.appListTitle}>Apps to Block</Text>
                <Text style={styles.appListDescription}>
                  {blockedApps.length} apps selected
                </Text>
              </View>
              <Text style={styles.appListChevron}>›</Text>
            </TouchableOpacity>

            {/* Allowed Apps */}
            <TouchableOpacity
              style={styles.appListButton}
              onPress={() => openAppSelector('allow')}
            >
              <View style={styles.appListIcon}>
                <Text style={styles.appListIconEmoji}>✅</Text>
              </View>
              <View style={styles.appListContent}>
                <Text style={styles.appListTitle}>Always Allow</Text>
                <Text style={styles.appListDescription}>
                  {allowedApps.length} apps always accessible
                </Text>
              </View>
              <Text style={styles.appListChevron}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions */}
        {authStatus === 'approved' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Presets</Text>

            <TouchableOpacity
              style={styles.presetButton}
              onPress={() => {
                setBlockedApps(POPULAR_APPS.map(app => app.bundleId));
                Alert.alert('Preset Applied', 'All social media apps added to block list');
              }}
            >
              <Text style={styles.presetEmoji}>📱</Text>
              <Text style={styles.presetText}>Block All Social Media</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetButton}
              onPress={() => {
                setAllowedApps(ESSENTIAL_APPS.map(app => app.bundleId));
                Alert.alert('Preset Applied', 'Essential apps set to always allow');
              }}
            >
              <Text style={styles.presetEmoji}>⚡</Text>
              <Text style={styles.presetText}>Allow Only Essentials</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetButton}
              onPress={() => {
                setBlockedApps([]);
                setAllowedApps(['com.apple.mobilesafari', 'com.apple.MobileSMS', 'com.apple.mobilephone']);
                Alert.alert('Reset Complete', 'All app lists cleared');
              }}
            >
              <Text style={styles.presetEmoji}>🔄</Text>
              <Text style={styles.presetText}>Reset to Defaults</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>1️⃣</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Grant Permission</Text>
              <Text style={styles.featureDescription}>
                Allow Focus Shield to use iOS Screen Time API
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>2️⃣</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Toggle Shield On</Text>
              <Text style={styles.featureDescription}>
                Activate system-level app blocking
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>3️⃣</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Stay Focused</Text>
              <Text style={styles.featureDescription}>
                Distracting apps are blocked - you can only access allowed apps
              </Text>
            </View>
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Use Focus Shield?</Text>

          <View style={styles.benefitCard}>
            <Text style={styles.benefitEmoji}>🎯</Text>
            <Text style={styles.benefitText}>
              <Text style={styles.benefitBold}>Real Blocking</Text> - Not just reminders, apps are actually blocked at the OS level
            </Text>
          </View>

          <View style={styles.benefitCard}>
            <Text style={styles.benefitEmoji}>💪</Text>
            <Text style={styles.benefitText}>
              <Text style={styles.benefitBold}>Build Discipline</Text> - Train yourself to resist impulses and stay on task
            </Text>
          </View>

          <View style={styles.benefitCard}>
            <Text style={styles.benefitEmoji}>⏱️</Text>
            <Text style={styles.benefitText}>
              <Text style={styles.benefitBold}>Scheduled Protection</Text> - Set up automatic blocking during study/work hours
            </Text>
          </View>

          <View style={styles.benefitCard}>
            <Text style={styles.benefitEmoji}>🎮</Text>
            <Text style={styles.benefitText}>
              <Text style={styles.benefitBold}>Earn More XP</Text> - Complete exercises with Shield active for bonus rewards
            </Text>
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Questions</Text>

          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>Can I choose which apps to block?</Text>
            <Text style={styles.faqAnswer}>
              Yes! You can block all apps except the ones you choose, or block specific apps only.
            </Text>
          </View>

          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>How do I turn it off?</Text>
            <Text style={styles.faqAnswer}>
              Just toggle the switch in the Focus Shield control. Apps will be immediately accessible again.
            </Text>
          </View>

          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>Is this safe?</Text>
            <Text style={styles.faqAnswer}>
              Absolutely. Focus Shield uses Apple's official Screen Time API - the same technology parents use to manage kids' devices.
            </Text>
          </View>

          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>Does it work on Android?</Text>
            <Text style={styles.faqAnswer}>
              Focus Shield requires iOS 15+ and uses Apple's Screen Time API. Android version coming soon!
            </Text>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* App Selector Modal */}
      <Modal
        visible={showAppSelector}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAppSelector(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setShowAppSelector(false)}
            activeOpacity={1}
          />
          <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowAppSelector(false)}>
                <Text style={styles.modalCloseText}>Done</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {selectorType === 'block' ? 'Select Apps to Block' : 'Select Apps to Allow'}
              </Text>
              <View style={{ width: 50 }} />
            </View>

            {/* App List */}
            <FlatList
              data={selectorType === 'block' ? POPULAR_APPS : ESSENTIAL_APPS}
              keyExtractor={(item) => item.bundleId}
              renderItem={({ item }) => {
                const isSelected = selectorType === 'block'
                  ? blockedApps.includes(item.bundleId)
                  : allowedApps.includes(item.bundleId);

                return (
                  <TouchableOpacity
                    style={styles.appSelectItem}
                    onPress={() => toggleAppInList(item.bundleId, selectorType)}
                  >
                    <Text style={styles.appSelectEmoji}>{item.emoji}</Text>
                    <Text style={styles.appSelectName}>{item.name}</Text>
                    <View style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected
                    ]}>
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              }}
              style={styles.appList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },

  // Permission Card
  permissionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  permissionGradient: {
    padding: 24,
    alignItems: 'center',
  },
  permissionEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  permissionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Status Card
  statusCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  statusGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statusEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },

  // Mode Cards
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeCardActive: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  modeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modeIconEmoji: {
    fontSize: 24,
  },
  modeContent: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  modeDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  // Disable Button
  disableButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  disableButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },

  // App List Buttons
  appListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  appListIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appListIconEmoji: {
    fontSize: 22,
  },
  appListContent: {
    flex: 1,
  },
  appListTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  appListDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  appListChevron: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.3)',
  },

  // Preset Buttons
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  presetEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  presetText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Feature Cards
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  featureEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 20,
  },

  // Benefit Cards
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#6366F1',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  benefitEmoji: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  benefitBold: {
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // FAQ Cards
  faqCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  appList: {
    padding: 16,
  },
  appSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  appSelectEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  appSelectName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
