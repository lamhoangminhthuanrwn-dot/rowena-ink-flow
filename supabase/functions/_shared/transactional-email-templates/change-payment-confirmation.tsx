import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'ROWENA Tattoo'

interface Props {
  confirmUrl?: string
}

const ChangePaymentConfirmationEmail = ({ confirmUrl }: Props) => (
  <Html lang="vi" dir="ltr">
    <Head />
    <Preview>Xác nhận đổi tài khoản thanh toán — {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>ROWENA <span style={brandSub}>tattoo</span></Text>
        <Heading style={h1}>Xác nhận đổi tài khoản thanh toán</Heading>
        <Text style={text}>
          Bạn đã yêu cầu thay đổi tài khoản thanh toán liên kết với ví ROWENA. Nhấn nút bên dưới để xác nhận:
        </Text>
        <Button style={button} href={confirmUrl || '#'}>
          Xác nhận đổi tài khoản
        </Button>
        <Text style={footer}>
          Link này có hiệu lực trong 30 phút. Nếu bạn không yêu cầu thay đổi này, vui lòng bỏ qua email này.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ChangePaymentConfirmationEmail,
  subject: 'Xác nhận đổi tài khoản thanh toán — ROWENA Tattoo',
  displayName: 'Xác nhận đổi tài khoản thanh toán',
  previewData: { confirmUrl: 'https://rowenatattoos.com/tai-khoan?change_token=sample' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
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
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.6', margin: '0 0 20px' }
const button = {
  backgroundColor: 'hsl(216, 19%, 26%)',
  color: 'hsl(210, 19%, 98%)',
  fontSize: '14px',
  fontWeight: '600' as const,
  borderRadius: '0px',
  padding: '12px 24px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
