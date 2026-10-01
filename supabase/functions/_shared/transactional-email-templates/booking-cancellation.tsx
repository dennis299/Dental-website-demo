import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  bookingId?: string
}

const CLINIC = { name: 'My Dental', phone: '+44 7426 905180' }

const Email = (p: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your appointment has been cancelled</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Appointment cancelled</Heading>
        <Text style={text}>
          Hi {p.name ?? 'there'}, your appointment {p.bookingId ? `(#${p.bookingId}) ` : ''}has been cancelled.
        </Text>
        <Text style={text}>
          Whenever you're ready, you can book again at any time.
        </Text>
        <Hr style={hr} />
        <Text style={muted}>Questions? Call {CLINIC.phone}, we're happy to help.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: `Your ${CLINIC.name} appointment was cancelled`,
  displayName: 'Booking cancellation',
  previewData: { name: 'Jane', bookingId: 'abc-123' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'ui-sans-serif, system-ui, Arial, sans-serif', color: '#0f172a' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 700, margin: '0 0 12px' }
const text = { fontSize: '15px', lineHeight: '22px', margin: '6px 0', color: '#334155' }
const muted = { fontSize: '13px', color: '#64748b', margin: '8px 0' }
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
