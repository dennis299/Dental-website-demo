import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  treatment?: string
  whenPretty?: string
  bookingId?: string
}

const CLINIC = {
  name: 'My Dental',
  address: '12 Harley Mews, London W1G 9PG, United Kingdom',
  phone: '+44 20 7946 0123',
}

const Email = (p: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your appointment has been rescheduled</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Appointment rescheduled</Heading>
        <Text style={text}>Hi {p.name ?? 'there'}, your appointment has been moved.</Text>
        <Section style={card}>
          <Text style={cardRow}><strong>Treatment:</strong> {p.treatment ?? 'Consultation'}</Text>
          <Text style={cardRow}><strong>New time:</strong> {p.whenPretty ?? '—'}</Text>
          <Text style={cardRow}><strong>Where:</strong> {CLINIC.address}</Text>
          <Text style={cardRow}><strong>Booking #:</strong> {p.bookingId ?? '—'}</Text>
        </Section>
        <Hr style={hr} />
        <Text style={muted}>Need another change? Reply to this email or call {CLINIC.phone}.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Props) => `Your appointment was moved to ${d.whenPretty ?? 'a new time'}`,
  displayName: 'Booking reschedule',
  previewData: { name: 'Jane', treatment: 'Cleaning', whenPretty: 'Wed, 24 June at 14:00', bookingId: 'abc-123' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'ui-sans-serif, system-ui, Arial, sans-serif', color: '#0f172a' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 700, margin: '0 0 12px' }
const text = { fontSize: '15px', lineHeight: '22px', margin: '6px 0', color: '#334155' }
const muted = { fontSize: '13px', color: '#64748b', margin: '8px 0' }
const card = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px', margin: '16px 0' }
const cardRow = { fontSize: '14px', margin: '4px 0', color: '#0f172a' }
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
