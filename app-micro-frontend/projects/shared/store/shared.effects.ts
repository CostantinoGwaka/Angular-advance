import { InputHintEffects } from '../components/store/input-hint/input-hint.effects';
import {NotificationEffects} from "../components/store/notification/notification.effects";
import {ClarificationNotificationEffects} from "../components/store/clarification-notification/clarification-notification.effects";
import {GovernmentServiceNotificationEffects} from "../components/store/government-service-notification/government-service-notification.effects";

export const SharedEffects = [
  InputHintEffects,
  NotificationEffects,
  ClarificationNotificationEffects,
  GovernmentServiceNotificationEffects
];
