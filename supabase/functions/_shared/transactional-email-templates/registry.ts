import * as React from 'npm:react@18.3.1'
import { template as bookingConfirmation } from './booking-confirmation.tsx'
import { template as bookingReschedule } from './booking-reschedule.tsx'
import { template as bookingCancellation } from './booking-cancellation.tsx'

export interface TemplateEntry {
  component: (props: any) => React.ReactElement
  subject: string | ((data: any) => string)
  displayName?: string
  previewData?: Record<string, any>
  to?: string | ((data: any) => string)
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'booking-confirmation': bookingConfirmation,
  'booking-reschedule': bookingReschedule,
  'booking-cancellation': bookingCancellation,
}
