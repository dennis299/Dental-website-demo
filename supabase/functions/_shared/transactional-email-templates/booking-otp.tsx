import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  code?: string
  expiresMinutes?: number
}

const CLINIC = { name: 'My Dental' }

const Email = (p: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your {CLINIC.name} verification code is {p.code ?? '------'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your verification code</Heading>
        <Text style={text}>
          Use this code to continue managing your appointment with {CLINIC.name}.
        </Text>

        <Section style={codeBox}>
          <Text style={codeText}>{p.code ?? '------'}</Text>
        </Section>

        <Text style={muted}>
          This code expires in {p.expiresMinutes ?? 10} minutes and can only be used once.
        </Text>

        <Hr style={hr} />
        <Text style={muted}>
          If you didn't request this, you can safely ignore this email — no changes will be made to any
          appointment.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Props) => `${CLINIC.name}: your verification code is ${d.code ?? ''}`.trim(),
  displayName: 'Booking verification code',
  previewData: { code: '482913', expiresMinutes: 10 },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'ui-sans-serif, system-ui, Arial, sans-serif', color: '#0f172a' }
const container = { padding: '32px 28px', maxWidth: '480px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }
const text = { fontSize: '15px', lineHeight: '22px', margin: '6px 0', color: '#334155' }
const muted = { fontSize: '13px', color: '#64748b', margin: '12px 0' }
const codeBox = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', margin: '20px 0', textAlign: 'center' as const }
const codeText = { fontSize: '32px', fontWeight: 700, letterSpacing: '8px', margin: 0, color: '#0f766e', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
