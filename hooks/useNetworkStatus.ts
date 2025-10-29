// hooks/useNetworkStatus.ts
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOnline(!!state.isConnected && !!state.isInternetReachable);
        });

        // Get initial state
        NetInfo.fetch().then(state => {
            setIsOnline(!!state.isConnected && !!state.isInternetReachable);
        });

        return unsubscribe;
    }, []);

    return isOnline;
}