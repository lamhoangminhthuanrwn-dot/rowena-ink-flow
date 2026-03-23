/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as bookingNotification } from './booking-notification.tsx'
import { template as withdrawalNotification } from './withdrawal-notification.tsx'
import { template as priceUpdateNotification } from './price-update-notification.tsx'
import { template as changePaymentConfirmation } from './change-payment-confirmation.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'booking-notification': bookingNotification,
  'withdrawal-notification': withdrawalNotification,
  'price-update-notification': priceUpdateNotification,
  'change-payment-confirmation': changePaymentConfirmation,
}
