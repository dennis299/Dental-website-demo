import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  treatment?: string
  whenPretty?: string
  whenISO?: string
  bookingId?: string
}

const CLINIC = {
  name: 'My Dental',
  address: '12 Harley Mews, London W1G 9PG, United Kingdom',
  phone: '+44 20 7946 0123',
  mapUrl: 'https://maps.google.com/?q=12+Harley+Mews+London+W1G+9PG',
  site: 'https://my-dental.space',
}

const buildIcsUrl = (p: Props) => {
  if (!p.whenISO) return CLINIC.site
  const start = new Date(p.whenISO)
  const end = new Date(start.getTime() + 45 * 60 * 1000)
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${p.treatment ?? 'Dental appointment'} — ${CLINIC.name}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    location: CLINIC.address,
    details: `Your appointment at ${CLINIC.name}. Booking #${p.bookingId ?? ''}`,
  })
  return `https://www.google.com/calendar/render?${params.toString()}`
}

const Email = (p: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your appointment at {CLINIC.name} is confirmed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You're all booked in ✨</Heading>
        <Text style={text}>
          Hi {p.name ?? 'there'}, your appointment at <strong>{CLINIC.name}</strong> is confirmed.
        </Text>

        <Section style={card}>
          <Text style={cardRow}><strong>Treatment:</strong> {p.treatment ?? 'Consultation'}</Text>
          <Text style={cardRow}><strong>When:</strong> {p.whenPretty ?? 'See booking'}</Text>
          <Text style={cardRow}><strong>Where:</strong> {CLINIC.address}</Text>
          <Text style={cardRow}><strong>Booking #:</strong> {p.bookingId ?? '—'}</Text>
        </Section>

        <Section style={{ textAlign: 'center', margin: '24px 0' }}>
          <Button href={buildIcsUrl(p)} style={btn}>Add to calendar</Button>
        </Section>

        <Text style={text}>
          <Link href={CLINIC.mapUrl} style={link}>Open in Google Maps →</Link>
        </Text>

        <Hr style={hr} />
        <Heading as="h2" style={h2}>Before your visit</Heading>
        <Text style={text}>• Brush and floss as usual — no need to skip.</Text>
        <Text style={text}>• Arrive 5 minutes early to settle in.</Text>
        <Text style={text}>• Bring a list of current medications, if any.</Text>
        <Text style={text}>• Let us know about anxiety — we'll go gently.</Text>

        <Hr style={hr} />
        <Text style={muted}>
          Need to change or cancel? Reply to this email or call {CLINIC.phone}.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Props) => `Your appointment at ${CLINIC.name} — ${d.whenPretty ?? 'confirmed'}`,
  displayName: 'Booking confirmation',
  previewData: {
    name: 'Jane',
    treatment: 'Teeth whitening',
    whenPretty: 'Tuesday, 23 June at 10:30',
    whenISO: '2026-06-23T10:30:00Z',
    bookingId: 'abc-123',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'ui-sans-serif, system-ui, Arial, sans-serif', color: '#0f172a' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }
const h2 = { fontSize: '16px', fontWeight: 600, margin: '20px 0 8px', color: '#0f172a' }
const text = { fontSize: '15px', lineHeight: '22px', margin: '6px 0', color: '#334155' }
const muted = { fontSize: '13px', color: '#64748b', margin: '8px 0' }
const card = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px', margin: '16px 0' }
const cardRow = { fontSize: '14px', margin: '4px 0', color: '#0f172a' }
const btn = { backgroundColor: '#0f766e', color: '#ffffff', padding: '12px 22px', borderRadius: '10px', fontWeight: 600, textDecoration: 'none' }
const link = { color: '#0f766e', textDecoration: 'underline' }
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
