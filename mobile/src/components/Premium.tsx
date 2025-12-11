import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';

interface PremiumProps {
  onBack: () => void;
}

const features = [
  {
    emoji: '❤️',
    title: 'Unlimited Hearts',
    description: 'Train anytime, without limits. Never run out of hearts and maintain your focus momentum.',
    highlighted: true,
  },
  {
    emoji: '🧠',
    title: 'Personalized Training Plan',
    description: 'AI-powered coach that adapts to your performance, weaknesses, and goals',
  },
  {
    emoji: '📊',
    title: 'Deep Analytics',
    description: 'Attention score, impulse control charts, and weekly/monthly progress visuals',
  },
  {
    emoji: '🌙',
    title: 'Wind-Down Mode',
    description: 'Guided breathing exercises for sleep and relaxation',
  },
  {
    emoji: '🎨',
    title: 'Custom Aesthetic Themes',
    description: 'Unlock 4 beautiful themes: minimal light, deep calm dark, vintage ink, and clean white studio',
  },
  {
    emoji: '✨',
    title: 'Premium Features',
    description: 'Access all current and future premium features',
  },
];

export function Premium({ onBack }: PremiumProps) {
  const { user, upgradeToPremium } = useAuth();
  const { colors } = useTheme();

  if (!user) return null;

  const handleUpgrade = async () => {
    await upgradeToPremium();
    Alert.alert('Success', 'Premium upgrade successful! (Demo mode - no payment processed)');
    onBack();
  };

  if (user.isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Premium" onBack={onBack} />
        <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
          <Card style={styles.premiumCard}>
          <View style={styles.premiumHeader}>
            <Text style={styles.premiumCrown}>👑</Text>
            <Text style={styles.premiumTitle}>You're a Premium Member!</Text>
            <Text style={styles.premiumSubtitle}>Enjoying all premium features</Text>
          </View>

          <View style={styles.featuresList}>
            {features.map((feature) => (
              <View key={feature.title} style={styles.featureRow}>
                <Text style={styles.checkmark}>✓</Text>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Premium" onBack={onBack} />
      <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconEmoji}>👑</Text>
          </View>
          <Text style={styles.title}>Upgrade to Premium</Text>
          <Text style={styles.subtitle}>
            Unlock advanced features and accelerate your focus training
          </Text>
        </View>

      {/* Pricing Card */}
      <Card style={styles.pricingCard}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Limited Time Offer</Text>
        </View>
        <Text style={styles.price}>$9.99/month</Text>
        <Text style={styles.priceSubtext}>or $99/year (save 17%)</Text>

        <View style={styles.featuresList}>
          {features.map((feature) => {
            const isHighlighted = feature.highlighted;
            return (
              <View
                key={feature.title}
                style={[
                  styles.featureRow,
                  isHighlighted && styles.featureRowHighlighted,
                ]}
              >
                <Text style={styles.featureEmoji}>{feature.emoji}</Text>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Card>

      {/* CTA */}
      <Button onPress={handleUpgrade} size="lg" style={styles.upgradeButton}>
        Upgrade Now
      </Button>

      <Text style={styles.footerText}>
        Cancel anytime • 7-day free trial
      </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#9ca3af',
    textAlign: 'center',
  },
  pricingCard: {
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  badge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 16,
  },
  badgeText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  priceSubtext: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresList: {
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureRowHighlighted: {
    backgroundColor: '#7f1d1d',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#991b1b',
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#9ca3af',
  },
  upgradeButton: {
    width: '100%',
    backgroundColor: '#f59e0b',
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  premiumCard: {
    padding: 24,
  },
  premiumHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  premiumCrown: {
    fontSize: 32,
    marginBottom: 12,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  checkmark: {
    fontSize: 20,
    color: '#10b981',
    marginRight: 12,
  },
});

