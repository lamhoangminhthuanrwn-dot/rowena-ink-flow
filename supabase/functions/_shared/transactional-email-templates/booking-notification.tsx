import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'ROWENA Tattoo'

interface Props {
  booking_code?: string
  customer_name?: string
  phone?: string
  email?: string
  design_name?: string
  placement?: string
  size?: string
  appointment_date?: string
  appointment_time?: string
  note?: string
}

const BookingNotificationEmail = (props: Props) => (
  <Html lang="vi" dir="ltr">
    <Head />
    <Preview>🔔 Booking mới — {props.booking_code || 'N/A'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>ROWENA <span style={brandSub}>tattoo</span></Text>
        <Heading style={h1}>🔔 Booking mới</Heading>
        <table style={table}>
          <tr><td style={labelCell}>Mã booking</td><td style={valueCell}>{props.booking_code || 'N/A'}</td></tr>
          <tr><td style={labelCell}>Khách hàng</td><td style={valueCell}>{props.customer_name || 'N/A'}</td></tr>
          <tr><td style={labelCell}>SĐT</td><td style={valueCell}>{props.phone || 'N/A'}</td></tr>
          <tr><td style={labelCell}>Email</td><td style={valueCell}>{props.email || 'N/A'}</td></tr>
          <tr><td style={labelCell}>Mẫu</td><td style={valueCell}>{props.design_name || 'N/A'}</td></tr>
          <tr><td style={labelCell}>Vị trí</td><td style={valueCell}>{props.placement || 'N/A'}</td></tr>
          <tr><td style={labelCell}>Kích thước</td><td style={valueCell}>{props.size || 'N/A'}</td></tr>
          <tr><td style={labelCell}>Ngày hẹn</td><td style={valueCell}>{props.appointment_date || 'N/A'} · {props.appointment_time || 'N/A'}</td></tr>
          <tr><td style={labelCell}>Ghi chú</td><td style={valueCell}>{props.note || 'Không có'}</td></tr>
        </table>
        <Hr style={hr} />
        <Text style={footer}>— {SITE_NAME} Studio</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: BookingNotificationEmail,
  subject: (data: Record<string, any>) => `[ROWENA] Booking mới ${data.booking_code || ''}`,
  displayName: 'Thông báo booking mới',
  to: 'lamhoangminhthuan@gmail.com',
  previewData: {
    booking_code: 'RWN-123456',
    customer_name: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'test@example.com',
    design_name: 'Hoa hồng',
    placement: 'Cánh tay',
    size: '10x15cm',
    appointment_date: '2026-04-01',
    appointment_time: '14:00',
    note: 'Muốn thêm lá',
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
const table = { width: '100%' as const, borderCollapse: 'collapse' as const, marginTop: '16px' }
const labelCell = { padding: '8px 0', color: '#6b7280', fontSize: '14px', verticalAlign: 'top' as const, width: '120px' }
const valueCell = { padding: '8px 0', color: '#1a1a1a', fontSize: '14px', fontWeight: '600' as const }
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '0' }
