/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="vi" dir="ltr">
    <Head />
    <Preview>Mã xác minh — ROWENA Tattoo</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>ROWENA <span style={brandSub}>tattoo</span></Text>
        <Heading style={h1}>Xác minh danh tính</Heading>
        <Text style={text}>Sử dụng mã bên dưới để xác minh danh tính của bạn:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          Mã này sẽ hết hạn sau một thời gian ngắn. Nếu bạn không yêu cầu mã này, hãy bỏ qua email này.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', 'Crimson Pro', Arial, sans-serif" }
const container = { padding: '32px 28px' }
const brand = {
  fontFamily: "'Crimson Pro', Georgia, serif",
  fontSize: '20px',
  fontWeight: 'bold' as const,
  color: 'hsl(222, 47%, 11%)',
  letterSpacing: '0.05em',
  margin: '0 0 24px',
}
const brandSub = {
  fontFamily: "'DM Sans', Arial, sans-serif",
  fontSize: '10px',
  fontWeight: '300' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.2em',
  color: 'hsl(215, 20%, 65%)',
}
const h1 = {
  fontFamily: "'Crimson Pro', Georgia, serif",
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: 'hsl(222, 47%, 11%)',
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: '#55575d',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const codeStyle = {
  fontFamily: "'SF Mono', Courier, monospace",
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: 'hsl(222, 47%, 11%)',
  letterSpacing: '0.15em',
  margin: '0 0 30px',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
