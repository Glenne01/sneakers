import nodemailer from 'nodemailer'

interface EmailConfig {
  to: string
  subject: string
  html: string
  text?: string
}

interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    size: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  shipping: number
  total: number
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    postalCode: string
    country: string
    phone: string
  }
}

// Configuration du transporteur email
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
}

// Template HTML pour l'email de confirmation
const generateOrderConfirmationHTML = (data: OrderEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de commande - SneakHouse</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
        .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; }
        .content { padding: 40px 20px; }
        .order-info { background-color: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 30px; }
        .order-number { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
        .greeting { font-size: 18px; color: #374151; margin-bottom: 20px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 15px; border-bottom: 2px solid #f97316; padding-bottom: 5px; }
        .item { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #e5e7eb; }
        .item:last-child { border-bottom: none; }
        .item-details { flex: 1; }
        .item-name { font-weight: 600; color: #1f2937; margin-bottom: 4px; }
        .item-meta { color: #6b7280; font-size: 14px; }
        .item-price { font-weight: 600; color: #1f2937; }
        .totals { background-color: #f9fafb; padding: 20px; border-radius: 12px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .total-row.final { font-size: 18px; font-weight: bold; border-top: 1px solid #d1d5db; padding-top: 10px; margin-top: 10px; }
        .address { background-color: #f9fafb; padding: 20px; border-radius: 12px; }
        .footer { background-color: #1f2937; padding: 30px 20px; text-align: center; }
        .footer p { color: #9ca3af; margin: 5px 0; }
        .footer a { color: #f97316; text-decoration: none; }
        .btn { display: inline-block; background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        @media (max-width: 600px) {
          .item { flex-direction: column; align-items: flex-start; }
          .item-price { margin-top: 8px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SneakHouse</h1>
          <p>Votre commande a été confirmée !</p>
        </div>

        <div class="content">
          <div class="order-info">
            <div class="order-number">Commande #${data.orderNumber}</div>
            <p style="color: #6b7280; margin: 0;">Merci pour votre achat !</p>
          </div>

          <div class="greeting">
            Bonjour ${data.customerName},
          </div>

          <p style="color: #374151; line-height: 1.6;">
            Nous avons bien reçu votre commande et nous la préparons avec soin.
            Vous recevrez un email de suivi dès que votre colis sera expédié.
          </p>

          <div class="section">
            <div class="section-title">Articles commandés</div>
            ${data.items.map(item => `
              <div class="item">
                <div class="item-details">
                  <div class="item-name">${item.name}</div>
                  <div class="item-meta">Taille ${item.size} • Quantité ${item.quantity}</div>
                </div>
                <div class="item-price">${(item.total).toFixed(2)} €</div>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <div class="section-title">Récapitulatif</div>
            <div class="totals">
              <div class="total-row">
                <span>Sous-total</span>
                <span>${data.subtotal.toFixed(2)} €</span>
              </div>
              <div class="total-row">
                <span>Livraison</span>
                <span>${data.shipping === 0 ? 'Gratuite' : data.shipping.toFixed(2) + ' €'}</span>
              </div>
              <div class="total-row final">
                <span>Total</span>
                <span>${data.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Adresse de livraison</div>
            <div class="address">
              <strong>${data.shippingAddress.firstName} ${data.shippingAddress.lastName}</strong><br>
              ${data.shippingAddress.address}<br>
              ${data.shippingAddress.postalCode} ${data.shippingAddress.city}<br>
              ${data.shippingAddress.country}<br>
              <br>
              <strong>Téléphone:</strong> ${data.shippingAddress.phone}
            </div>
          </div>

          <div style="text-align: center;">
            <a href="https://sneakhouse.fr/commandes" class="btn">Suivre ma commande</a>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b; margin-top: 30px;">
            <p style="margin: 0; color: #92400e;">
              <strong>Livraison gratuite</strong> pour toute commande supérieure à 100€ !
            </p>
          </div>
        </div>

        <div class="footer">
          <p><strong>SneakHouse</strong></p>
          <p>Votre destination premium pour les sneakers Adidas</p>
          <p>
            <a href="mailto:contact@sneakhouse.fr">contact@sneakhouse.fr</a> |
            <a href="https://sneakhouse.fr">www.sneakhouse.fr</a>
          </p>
          <p style="font-size: 12px; margin-top: 20px;">
            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Fonction pour envoyer l'email de confirmation de commande
export const sendOrderConfirmationEmail = async (data: OrderEmailData): Promise<boolean> => {
  try {
    const transporter = createTransporter()

    const mailOptions: EmailConfig = {
      to: data.customerEmail,
      subject: `Confirmation de commande #${data.orderNumber} - SneakHouse`,
      html: generateOrderConfirmationHTML(data),
      text: `
Bonjour ${data.customerName},

Votre commande #${data.orderNumber} a été confirmée !

Articles commandés:
${data.items.map(item => `- ${item.name} (Taille ${item.size}) x${item.quantity} - ${item.total.toFixed(2)} €`).join('\n')}

Sous-total: ${data.subtotal.toFixed(2)} €
Livraison: ${data.shipping === 0 ? 'Gratuite' : data.shipping.toFixed(2) + ' €'}
Total: ${data.total.toFixed(2)} €

Adresse de livraison:
${data.shippingAddress.firstName} ${data.shippingAddress.lastName}
${data.shippingAddress.address}
${data.shippingAddress.postalCode} ${data.shippingAddress.city}
${data.shippingAddress.country}

Merci pour votre confiance !
L'équipe SneakHouse
      `
    }

    const info = await transporter.sendMail({
      from: `"SneakHouse" <${process.env.EMAIL_USER}>`,
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html
    })

    console.log('Email envoyé:', info.messageId)
    return true
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    return false
  }
}

// Fonction générique pour envoyer des emails
export const sendEmail = async (config: EmailConfig): Promise<boolean> => {
  try {
    const transporter = createTransporter()

    const info = await transporter.sendMail({
      from: `"SneakHouse" <${process.env.EMAIL_USER}>`,
      to: config.to,
      subject: config.subject,
      text: config.text,
      html: config.html
    })

    console.log('Email envoyé:', info.messageId)
    return true
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    return false
  }
}