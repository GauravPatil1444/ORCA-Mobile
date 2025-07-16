import { createNavigationContainerRef } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import type { DrawerParamList } from '../App';

export const navigationRef = createNavigationContainerRef<DrawerParamList>();

export function jumpTo(name: keyof DrawerParamList, params?: DrawerParamList[typeof name]) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch({
      ...DrawerActions.jumpTo(name, params),
    });
  }
}
