import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'ROWENA Tattoo'

interface Props {
  booking_code?: string
  customer_name?: string
  old_price?: string
  new_price?: string
  time?: string
}

const PriceUpdateNotificationEmail = (props: Props) => (
  <Html lang="vi" dir="ltr">
    <Head />
    <Preview>💰 Giá đơn hàng đã thay đổi — {props.booking_code || ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>ROWENA <span style={brandSub}>tattoo</span></Text>
        <Heading style={h1}>💰 Giá đơn hàng đã thay đổi</Heading>
        <table style={table}>
          <tr><td style={labelCell}>Mã booking</td><td style={valueCell}>{props.booking_code || 'N/A'}</td></tr>
          <tr><td style={labelCell}>Khách hàng</td><td style={valueCell}>{props.customer_name || 'N/A'}</td></tr>
          <tr><td style={labelCell}>Giá cũ</td><td style={valueCell}>{props.old_price || 'Chưa có'}</td></tr>
          <tr><td style={labelCell}>Giá mới</td><td style={newPriceCell}>{props.new_price || 'N/A'}</td></tr>
          <tr><td style={labelCell}>Thời gian</td><td style={valueCell}>{props.time || 'N/A'}</td></tr>
        </table>
        <Hr style={hr} />
        <Text style={footer}>— {SITE_NAME} Studio</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PriceUpdateNotificationEmail,
  subject: (data: Record<string, any>) => `[Rowena] Cập nhật giá: ${data.booking_code || ''}`,
  displayName: 'Thông báo thay đổi giá',
  to: 'lamhoangminhthuan@gmail.com',
  previewData: {
    booking_code: 'RWN-123456',
    customer_name: 'Nguyễn Văn A',
    old_price: '2,000,000đ',
    new_price: '2,500,000đ',
    time: '23/03/2026, 10:30:00',
  },
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
const table = { width: '100%' as const, borderCollapse: 'collapse' as const }
const labelCell = { padding: '8px 0', color: '#6b7280', fontSize: '14px', width: '120px' }
const valueCell = { padding: '8px 0', color: '#1a1a1a', fontSize: '14px', fontWeight: '600' as const }
const newPriceCell = { padding: '8px 0', color: '#d4a843', fontSize: '14px', fontWeight: '700' as const }
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '0' }
