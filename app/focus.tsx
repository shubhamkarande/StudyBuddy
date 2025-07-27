import { RootState } from '@/store';
import { endSession, pauseSession, resumeSession, tick } from '@/store/slices/focusSlice';
import { recordSession } from '@/store/slices/streakSlice';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function FocusScreen() {
  const { currentSession, timeRemaining, status } = useSelector((state: RootState) => state.focus);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (status === 'running') {
      interval = setInterval(() => {
        dispatch(tick());
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, dispatch]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Prevent back navigation during focus session
      return status === 'running';
    });

    return () => backHandler.remove();
  }, [status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = () => {
    if (currentSession) {
      const sessionDuration = currentSession.duration - timeRemaining;
      dispatch(recordSession({ 
        duration: sessionDuration, 
        date: new Date().toISOString().split('T')[0] 
      }));
    }
    dispatch(endSession());
    router.back();
  };

  const getProgressPercentage = () => {
    if (!currentSession) return 0;
    return ((currentSession.duration - timeRemaining) / currentSession.duration) * 100;
  };

  if (!currentSession) {
    router.back();
    return null;
  }

  return (
    <View className="flex-1 bg-gray-900">
      {/* Minimal Header */}
      <View className="flex-row justify-between items-center px-6 pt-12 pb-6">
        <View className="w-6" />
        <Text className="text-white font-medium capitalize">{currentSession.mode} Mode</Text>
        <TouchableOpacity onPress={handleEndSession}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Timer */}
      <View className="flex-1 justify-center items-center px-6">
        {/* Large Timer Display */}
        <View className="items-center mb-12">
          <Text className="text-8xl font-light text-white mb-4">
            {formatTime(timeRemaining)}
          </Text>
          <Text className="text-gray-400 text-xl">
            {status === 'running' ? 'Stay Focused' : status === 'paused' ? 'Paused' : 'Completed!'}
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="w-full max-w-sm mb-12">
          <View className="bg-gray-700 h-2 rounded-full">
            <View 
              className="bg-primary-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </View>
          <View className="flex-row justify-between mt-2">
            <Text className="text-gray-500 text-sm">0:00</Text>
            <Text className="text-gray-500 text-sm">
              {formatTime(currentSession.duration)}
            </Text>
          </View>
        </View>

        {/* Control Button */}
        <View className="items-center">
          {status === 'running' ? (
            <TouchableOpacity
              className="bg-yellow-600 w-20 h-20 rounded-full justify-center items-center"
              onPress={() => dispatch(pauseSession())}
            >
              <Ionicons name="pause" size={32} color="white" />
            </TouchableOpacity>
          ) : status === 'paused' ? (
            <TouchableOpacity
              className="bg-green-600 w-20 h-20 rounded-full justify-center items-center"
              onPress={() => dispatch(resumeSession())}
            >
              <Ionicons name="play" size={32} color="white" />
            </TouchableOpacity>
          ) : (
            <View className="items-center">
              <Ionicons name="checkmark-circle" size={64} color="#10b981" />
              <Text className="text-green-400 text-2xl font-semibold mt-4">Well Done!</Text>
              <Text className="text-gray-400 mt-2">You completed your focus session</Text>
            </View>
          )}
        </View>
      </View>

      {/* Bottom Info */}
      <View className="px-6 pb-8">
        <View className="bg-gray-800 rounded-xl p-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-400 text-sm">Session</Text>
              <Text className="text-white font-medium capitalize">{currentSession.mode}</Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-400 text-sm">Duration</Text>
              <Text className="text-white font-medium">{Math.floor(currentSession.duration / 60)}m</Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-sm">Progress</Text>
              <Text className="text-white font-medium">{Math.round(getProgressPercentage())}%</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}