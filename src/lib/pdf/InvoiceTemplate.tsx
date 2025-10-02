import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #ff6b35',
    paddingBottom: 20,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 5,
  },
  companyInfo: {
    fontSize: 10,
    color: '#666',
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  infoBlock: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#666',
    marginBottom: 3,
  },
  value: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 8,
    fontWeight: 'bold',
    borderBottom: '1 solid #ddd',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1 solid #eee',
  },
  col1: { width: '40%' },
  col2: { width: '15%' },
  col3: { width: '15%' },
  col4: { width: '15%' },
  col5: { width: '15%', textAlign: 'right' },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '40%',
    marginBottom: 5,
  },
  totalLabel: {
    width: '60%',
    textAlign: 'right',
    paddingRight: 10,
  },
  totalValue: {
    width: '40%',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  grandTotal: {
    borderTop: '2 solid #333',
    paddingTop: 8,
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#999',
    borderTop: '1 solid #eee',
    paddingTop: 10,
  },
})

interface InvoiceData {
  orderNumber: string
  orderDate: string
  customer: {
    name: string
    email: string
    address: string
  }
  items: Array<{
    productName: string
    variantColor: string
    sizeValue: string
    quantity: number
    unitPrice: number
    lineTotal: number
  }>
  subtotal: number
  shipping: number
  total: number
}

export const InvoiceTemplate = ({ data }: { data: InvoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.companyName}>SNEAKERS SHOP</Text>
        <Text style={styles.companyInfo}>Email: contact@sneakers-shop.com</Text>
        <Text style={styles.companyInfo}>Téléphone: +33 1 23 45 67 89</Text>
      </View>

      {/* Invoice Title */}
      <Text style={styles.invoiceTitle}>FACTURE</Text>

      {/* Invoice Info */}
      <View style={styles.invoiceInfo}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Numéro de facture</Text>
          <Text style={styles.value}>{data.orderNumber}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{data.orderDate}</Text>
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Facturé à</Text>
        <Text style={styles.value}>{data.customer.name}</Text>
        <Text>{data.customer.email}</Text>
        <Text>{data.customer.address}</Text>
      </View>

      {/* Items Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Détails de la commande</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Produit</Text>
            <Text style={styles.col2}>Couleur</Text>
            <Text style={styles.col3}>Taille</Text>
            <Text style={styles.col4}>Qté</Text>
            <Text style={styles.col5}>Total</Text>
          </View>
          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>{item.productName}</Text>
              <Text style={styles.col2}>{item.variantColor}</Text>
              <Text style={styles.col3}>{item.sizeValue}</Text>
              <Text style={styles.col4}>{item.quantity}</Text>
              <Text style={styles.col5}>{item.lineTotal.toFixed(2)} €</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Totals */}
      <View style={styles.totalsSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Sous-total :</Text>
          <Text style={styles.totalValue}>{data.subtotal.toFixed(2)} €</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Livraison :</Text>
          <Text style={styles.totalValue}>{data.shipping.toFixed(2)} €</Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotal]}>
          <Text style={styles.totalLabel}>TOTAL TTC :</Text>
          <Text style={styles.totalValue}>{data.total.toFixed(2)} €</Text>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Merci de votre commande ! Pour toute question, contactez-nous à contact@sneakers-shop.com
      </Text>
    </Page>
  </Document>
)
