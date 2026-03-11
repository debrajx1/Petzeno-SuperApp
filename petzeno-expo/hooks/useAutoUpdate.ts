import { useEffect, useState } from 'react';
import { Alert, AppState, AppStateStatus, Platform } from 'react-native';
import * as Updates from 'expo-updates';

export function useAutoUpdate() {
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Only run in standalone apps (not in Expo Go or Web)
    if (__DEV__ || Platform.OS === 'web') return;

    const checkUpdate = async () => {
      try {
        setIsChecking(true);
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          Alert.alert(
            "New Update Available! 🚀",
            "A new version of Petzeno is ready. Update now to get the latest features and fixes.",
            [
              { text: "Later", style: "cancel" },
              {
                text: "Update Now",
                onPress: async () => {
                  try {
                    await Updates.fetchUpdateAsync();
                    await Updates.reloadAsync();
                  } catch (e) {
                    Alert.alert("Update Failed", "Could not download the update. Please try again later.");
                  }
                }
              }
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        console.log("Error checking for updates:", error);
      } finally {
        setIsChecking(false);
      }
    };

    // Check when app starts
    checkUpdate();

    // Check again when app comes to foreground
    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        checkUpdate();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return { isChecking };
}
