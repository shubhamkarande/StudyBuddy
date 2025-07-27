import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { updateSettings } from '@/store/slices/focusSlice';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function Settings() {
  const { user, isGuest } = useSelector((state: RootState) => state.auth);
  const { settings } = useSelector((state: RootState) => state.focus);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              dispatch(logout());
              router.replace('/auth');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <Ionicons name={icon as any} size={24} color="#3b82f6" />
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || (onPress && <Ionicons name="chevron-forward" size={20} color="#6b7280" />)}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Settings</Text>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {isGuest ? 'G' : (user?.displayName?.[0] || user?.email?.[0] || 'U')}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {isGuest ? 'Guest User' : (user?.displayName || 'User')}
                </Text>
                <Text style={styles.profileEmail}>
                  {isGuest ? 'Local account' : user?.email}
                </Text>
              </View>
            </View>
            
            {isGuest && (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => router.push('/auth')}
              >
                <Text style={styles.upgradeButtonText}>Sign Up to Sync Data</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Focus Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Focus Settings</Text>
          <View style={styles.settingsCard}>
            <SettingItem
              icon="timer"
              title="Pomodoro Duration"
              subtitle={`${Math.floor(settings.pomodoroWork / 60)} minutes work, ${Math.floor(settings.pomodoroBreak / 60)} minutes break`}
              onPress={() => {
                Alert.alert('Coming Soon', 'Custom durations will be available in a future update');
              }}
            />
            
            <SettingItem
              icon="time"
              title="Deep Focus Duration"
              subtitle={`${Math.floor(settings.deepFocus / 60)} minutes`}
              onPress={() => {
                Alert.alert('Coming Soon', 'Custom durations will be available in a future update');
              }}
            />

            <SettingItem
              icon="volume-high"
              title="Sound Effects"
              subtitle="Play sounds during focus sessions"
              rightElement={
                <Switch
                  value={settings.soundEnabled}
                  onValueChange={(value) => dispatch(updateSettings({ soundEnabled: value }))}
                  trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                  thumbColor={settings.soundEnabled ? '#ffffff' : '#f3f4f6'}
                />
              }
            />

            <SettingItem
              icon="musical-notes"
              title="Ambient Sounds"
              subtitle={`Currently: ${settings.ambientSound}`}
              onPress={() => {
                Alert.alert(
                  'Ambient Sounds',
                  'Choose your preferred background sound',
                  [
                    { text: 'Silence', onPress: () => dispatch(updateSettings({ ambientSound: 'silence' })) },
                    { text: 'Rain', onPress: () => dispatch(updateSettings({ ambientSound: 'rain' })) },
                    { text: 'Café', onPress: () => dispatch(updateSettings({ ambientSound: 'cafe' })) },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            />
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.settingsCard}>
            <SettingItem
              icon="notifications"
              title="Notifications"
              subtitle="Manage your notification preferences"
              onPress={() => {
                Alert.alert('Coming Soon', 'Notification settings will be available in a future update');
              }}
            />
            
            <SettingItem
              icon="moon"
              title="Dark Mode"
              subtitle="Coming soon"
              onPress={() => {
                Alert.alert('Coming Soon', 'Dark mode will be available in a future update');
              }}
            />

            <SettingItem
              icon="language"
              title="Language"
              subtitle="English"
              onPress={() => {
                Alert.alert('Coming Soon', 'Multiple languages will be available in a future update');
              }}
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.settingsCard}>
            <SettingItem
              icon="help-circle"
              title="Help & FAQ"
              onPress={() => {
                Alert.alert('Help', 'For support, please contact us at support@studybuddy.app');
              }}
            />
            
            <SettingItem
              icon="star"
              title="Rate StudyBuddy"
              onPress={() => {
                Alert.alert('Thank You!', 'Rating feature will be available when the app is published');
              }}
            />

            <SettingItem
              icon="information-circle"
              title="About"
              onPress={() => {
                Alert.alert('StudyBuddy', 'Version 1.0.0\n\nFocus. Plan. Succeed.\n\nBuilt with React Native and Expo');
              }}
            />
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>
              {isGuest ? 'Exit Guest Mode' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>StudyBuddy v1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    paddingTop: 48,
    paddingBottom: 24,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: 'white',
    marginHorizontal: 0,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    backgroundColor: '#2563eb',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 18,
  },
  profileEmail: {
    color: '#6b7280',
  },
  upgradeButton: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  settingsCard: {
    backgroundColor: 'white',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    color: '#111827',
    fontWeight: '500',
  },
  settingSubtitle: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 24,
  },
  logoutButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    marginTop: 32,
    paddingBottom: 32,
  },
  footerText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
  },
});