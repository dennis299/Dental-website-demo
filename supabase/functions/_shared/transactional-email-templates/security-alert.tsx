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

interface Finding {
  severity?: string
  title?: string
  description?: string
  remediation?: string
  subject?: string
}

interface Props {
  scannedAt?: string
  findings?: Finding[]
}

const Email = (p: Props) => {
  const findings = p.findings ?? []
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{findings.length} new security finding(s) detected</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New security findings</Heading>
          <Text style={text}>
            The daily security scan detected {findings.length} new issue
            {findings.length === 1 ? '' : 's'} on your backend.
          </Text>
          <Text style={muted}>Scan time: {p.scannedAt ?? new Date().toISOString()}</Text>

          {findings.map((f, i) => (
            <Section key={i} style={card}>
              <Text style={badge(f.severity)}>
                {(f.severity ?? 'info').toUpperCase()}
              </Text>
              <Text style={cardTitle}>{f.title ?? 'Security finding'}</Text>
              {f.subject && <Text style={muted}>Subject: {f.subject}</Text>}
              {f.description && <Text style={text}>{f.description}</Text>}
              {f.remediation && (
                <Text style={remText}>
                  <strong>Fix:</strong> {f.remediation}
                </Text>
              )}
            </Section>
          ))}

          <Hr style={hr} />
          <Text style={muted}>
            Open your project's Security tab to review and resolve these findings.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: (data: Props) =>
    `[Security] ${data.findings?.length ?? 0} new finding(s) detected`,
  displayName: 'Security alert',
  previewData: {
    scannedAt: new Date().toISOString(),
    findings: [
      {
        severity: 'high',
        title: 'Permissive SELECT policy on public.bookings',
        subject: 'public.bookings',
        description: 'A policy allows all authenticated users to read every row.',
        remediation: 'Restrict the policy to auth.uid() or revoke SELECT.',
      },
    ],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }
const text = { fontSize: '14px', lineHeight: '22px', color: '#1f2937', margin: '6px 0' }
const muted = { fontSize: '12px', color: '#64748b', margin: '4px 0' }
const card = {
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  padding: '14px 16px',
  margin: '12px 0',
  backgroundColor: '#f8fafc',
}
const cardTitle = { fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '4px 0' }
const remText = { fontSize: '13px', color: '#0f172a', margin: '6px 0' }
const hr = { borderColor: '#e2e8f0', margin: '20px 0' }
const badge = (sev?: string): React.CSSProperties => {
  const map: Record<string, string> = {
    critical: '#b91c1c',
    high: '#c2410c',
    medium: '#a16207',
    low: '#0369a1',
    info: '#475569',
  }
  return {
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#ffffff',
    backgroundColor: map[(sev ?? 'info').toLowerCase()] ?? '#475569',
    padding: '3px 8px',
    borderRadius: '999px',
    margin: '0 0 6px',
  }
}
