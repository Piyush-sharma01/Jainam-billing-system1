import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Builds a jsPDF document for an invoice returned by the backend
// (InvoiceDTO shape: invoiceNumber, client, lineItems[], subtotal,
// taxAmount, grandTotal, notes, status, invoiceDate, dueDate).
export function buildInvoicePdf(invoice) {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text('Jainam Enterprises', 14, 18)

  doc.setFontSize(10)
  doc.setTextColor(90)
  doc.text(`Invoice ${invoice.invoiceNumber || ''}`, 14, 25)
  doc.setTextColor(0)

  doc.setFontSize(10)
  doc.text('Bill To:', 14, 36)
  doc.text(String(invoice.client?.company || 'N/A'), 14, 41)
  doc.text(String(invoice.client?.contactPerson || ''), 14, 46)
  doc.text(String(invoice.client?.address || ''), 14, 51)
  doc.text(`GSTIN: ${invoice.client?.gstNumber || 'N/A'}`, 14, 56)

  doc.text(
    `Invoice Date: ${invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : 'N/A'}`,
    130,
    36
  )
  doc.text(
    `Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}`,
    130,
    41
  )
  doc.text(`Status: ${invoice.status || 'PENDING'}`, 130, 46)

  autoTable(doc, {
    startY: 64,
    head: [['Item', 'Qty', 'Unit Price', 'GST', 'Total']],
    body: (invoice.lineItems || []).map((item) => [
      item.productName || '',
      String(item.quantity ?? ''),
      `Rs. ${Number(item.unitPrice ?? 0).toFixed(2)}`,
      `${Number(item.gstPercentage ?? 0)}%`,
      `Rs. ${Number(item.total ?? 0).toFixed(2)}`,
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [31, 41, 55] },
  })

  const finalY = (doc.lastAutoTable?.finalY || 64) + 10

  doc.setFontSize(10)
  doc.text(`Subtotal: Rs. ${Number(invoice.subtotal ?? 0).toFixed(2)}`, 140, finalY)
  doc.text(`Tax: Rs. ${Number(invoice.taxAmount ?? 0).toFixed(2)}`, 140, finalY + 6)
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text(`Total: Rs. ${Number(invoice.grandTotal ?? 0).toFixed(2)}`, 140, finalY + 14)
  doc.setFont(undefined, 'normal')

  if (invoice.notes) {
    doc.setFontSize(9)
    doc.setTextColor(90)
    const noteLines = doc.splitTextToSize(`Notes: ${invoice.notes}`, 120)
    doc.text(noteLines, 14, finalY + 24)
    doc.setTextColor(0)
  }

  return doc
}

export function invoiceFileName(invoice) {
  return `Invoice-${invoice.invoiceNumber || invoice.id || Date.now()}.pdf`
}

function invoiceWhatsAppMessage(invoice) {
  return (
    `Invoice ${invoice.invoiceNumber || ''} for ${invoice.client?.company || ''}\n` +
    `Total: Rs. ${Number(invoice.grandTotal ?? 0).toFixed(2)}\n` +
    `Due: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}`
  )
}

// Generates the PDF, downloads it, and then hands it straight to the
// WhatsApp number of the marketing team member who created the invoice
// (marketerPhone) — not the client. That keeps the "share to WhatsApp"
// step on the marketer's own account, so they can review/forward it
// from there.
//  1. Native Web Share (navigator.share with a file) — on Android/mobile
//     Chrome this opens the OS share sheet where the marketer picks
//     WhatsApp and the PDF goes as a real attachment. Since it's their
//     own device/WhatsApp account, this already satisfies "share to
//     own account" — marketerPhone isn't needed for this path.
//  2. Falls back to opening a wa.me chat with marketerPhone, pre-filled
//     with a message. Browsers cannot attach a file to WhatsApp via a
//     URL (no such API exists for security reasons), so in this
//     fallback the already-downloaded PDF needs to be attached
//     manually from Downloads.
export async function downloadAndShareInvoice(invoice, marketerPhone) {
  const doc = buildInvoicePdf(invoice)
  const fileName = invoiceFileName(invoice)

  // 1. Auto-download the PDF immediately.
  doc.save(fileName)

  const message = invoiceWhatsAppMessage(invoice)
  const marketerDigits = (marketerPhone || '').replace(/[^0-9]/g, '')

  // 2. Try the native share sheet so the PDF itself can be attached.
  try {
    const pdfBlob = doc.output('blob')
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' })

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: `Invoice ${invoice.invoiceNumber || ''}`,
        text: message,
      })
      return { method: 'native-share' }
    }
  } catch (err) {
    // User cancelled the share sheet, or it's unsupported on this
    // browser/device — fall through to the WhatsApp link below.
    console.warn('Native share unavailable or cancelled:', err)
  }

  // 3. Fallback: open WhatsApp (Web on desktop, app on mobile) in a chat
  // with the marketer's own number, with a ready-made message. If no
  // marketer phone is on file, wa.me/ opens WhatsApp's contact picker
  // instead so the message still isn't lost.
  const encodedMessage = encodeURIComponent(message + '\n(Invoice PDF downloaded — please attach it here)')
  const waUrl = marketerDigits
    ? `https://wa.me/${marketerDigits}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`

  window.open(waUrl, '_blank')
  return { method: 'wa-link' }
}
