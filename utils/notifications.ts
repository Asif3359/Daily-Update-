import { Platform } from 'react-native';
import { Notifications } from 'react-native-notifications';

export function initializeNotifications() {
  // Register permission prompts and listeners once at app start
  Notifications.registerRemoteNotifications();

  // Optional: handle foreground display behavior
  Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
    completion({ alert: true, sound: true, badge: false });
  });

  // Optional: handle taps
  Notifications.events().registerNotificationOpened((_notification, completion) => {
    completion();
  });

  // iOS 15+: request authorization explicitly (Android handled by manifest)
  if (Platform.OS === 'ios') {
    Notifications.ios.registerRemoteNotifications();
  }
}

export async function scheduleTaskReminder(params: {
  id: string; // we supply our own id
  title: string;
  body: string;
  fireDate: Date;
  payload?: Record<string, any>;
}): Promise<string | null> {
  const when = params.fireDate.getTime();
  if (Number.isNaN(when) || when <= Date.now()) {
    return null; // don't schedule past times
  }

  const notificationPayload: any = {
    title: params.title,
    body: params.body,
    sound: 'default',
    userInfo: { id: params.id, ...(params.payload || {}) },
  };

  // fireDate format: iOS expects ISO string; Android accepts epoch ms under fireDate as string as well.
  // react-native-notifications accepts optional third argument as Date for scheduling on iOS,
  // but also respects fireDate on both platforms.
  (notificationPayload as any).fireDate = new Date(when).toISOString();

  try {
    // Returns a generated id on some platforms; we also pass our own id for cancellation
    const returnedId = await Notifications.postLocalNotification(notificationPayload as any);
    // Prefer our supplied id for consistent cancellation cross-platform
    return params.id || (typeof returnedId === 'string' ? returnedId : null);
  } catch (e) {
    return null;
  }
}

export async function cancelTaskReminder(notificationId?: string | null) {
  if (!notificationId) return;
  try {
    // API supports cancel by id if previously provided in userInfo.id
    await Notifications.cancelLocalNotification(notificationId as any);
  } catch (e) {
    // noop
  }
}


