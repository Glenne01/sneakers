interface OrderConfirmationEmailProps {
  customerName: string
  orderNumber: string
  orderDate: string
  items: Array<{
    productName: string
    variantColor: string
    sizeValue: string
    quantity: number
    lineTotal: number
  }>
  subtotal: number
  shipping: number
  total: number
  orderUrl: string
}

export const OrderConfirmationEmail = ({
  customerName,
  orderNumber,
  orderDate,
  items,
  subtotal,
  shipping,
  total,
  orderUrl,
}: OrderConfirmationEmailProps) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de commande</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #ff6b35; padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">SNEAKERS SHOP</h1>
            </td>
          </tr>

          <!-- Success Icon -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <div style="width: 60px; height: 60px; background-color: #4caf50; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <span style="color: white; font-size: 30px;">✓</span>
              </div>
              <h2 style="margin: 0 0 10px; color: #333; font-size: 24px;">Commande confirmée !</h2>
              <p style="margin: 0; color: #666; font-size: 14px;">Merci pour votre commande ${customerName}</p>
            </td>
          </tr>

          <!-- Order Info -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px; padding: 20px;">
                <tr>
                  <td style="padding-bottom: 10px;">
                    <strong style="color: #333;">Numéro de commande:</strong>
                    <span style="color: #666;">${orderNumber}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong style="color: #333;">Date:</strong>
                    <span style="color: #666;">${orderDate}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <h3 style="margin: 0 0 15px; color: #333; font-size: 18px;">Détails de la commande</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e0e0e0;">
                ${items.map(item => `
                  <tr>
                    <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;">
                      <div style="margin-bottom: 5px;">
                        <strong style="color: #333; font-size: 14px;">${item.productName}</strong>
                      </div>
                      <div style="color: #666; font-size: 13px;">
                        ${item.variantColor} • Taille ${item.sizeValue} • Quantité: ${item.quantity}
                      </div>
                    </td>
                    <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; text-align: right;">
                      <strong style="color: #333;">${item.lineTotal.toFixed(2)} €</strong>
                    </td>
                  </tr>
                `).join('')}
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; text-align: right; color: #666;">Sous-total:</td>
                  <td style="padding: 8px 0; text-align: right; width: 100px;"><strong>${subtotal.toFixed(2)} €</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; text-align: right; color: #666;">Livraison:</td>
                  <td style="padding: 8px 0; text-align: right;"><strong>${shipping.toFixed(2)} €</strong></td>
                </tr>
                <tr style="border-top: 2px solid #333;">
                  <td style="padding: 12px 0; text-align: right; font-size: 16px;"><strong>TOTAL TTC:</strong></td>
                  <td style="padding: 12px 0; text-align: right; font-size: 16px;"><strong style="color: #ff6b35;">${total.toFixed(2)} €</strong></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 40px; text-align: center;">
              <a href="${orderUrl}" style="display: inline-block; background-color: #ff6b35; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">Voir ma commande</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px; color: #666; font-size: 13px;">
                Besoin d'aide ? Contactez-nous à <a href="mailto:contact@sneakers-shop.com" style="color: #ff6b35;">contact@sneakers-shop.com</a>
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                © 2025 Sneakers Shop. Tous droits réservés.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
