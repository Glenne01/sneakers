# 🔌 API Documentation SneakHouse

## Vue d'ensemble

SneakHouse utilise une architecture hybride combinant Next.js API Routes pour les fonctionnalités spécialisées et Supabase pour les opérations CRUD standard.

## API Routes Next.js

### Email API

#### POST `/api/send-confirmation`

Envoie un email de confirmation de commande.

**Headers:**
```http
Content-Type: application/json
```

**Body:**
```typescript
{
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
```

**Response:**
```typescript
// Success 200
{
  success: true,
  message: "Email envoyé avec succès"
}

// Error 500
{
  success: false,
  error: "Erreur lors de l'envoi de l'email",
  details: string
}
```

**Exemple d'utilisation:**
```javascript
const response = await fetch('/api/send-confirmation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderNumber: 'SH-123456',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    items: [{
      name: 'Nike Air Max',
      size: '42',
      quantity: 1,
      price: 150.00,
      total: 150.00
    }],
    subtotal: 150.00,
    shipping: 9.99,
    total: 159.99,
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      phone: '0123456789'
    }
  })
})
```

### Stock API (À implémenter)

#### GET `/api/stock/[productId]`

Récupère le stock d'un produit.

#### POST `/api/stock/update`

Met à jour le stock d'une variante.

## Intégrations Supabase

### Configuration Client

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Opérations de Base

#### Users

```typescript
// Créer un utilisateur
const { data, error } = await supabase
  .from('users')
  .insert({
    email: 'user@example.com',
    first_name: 'John',
    last_name: 'Doe',
    role: 'customer'
  })
  .select()
  .single()

// Récupérer un utilisateur
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', 'user@example.com')
  .single()

// Mettre à jour un utilisateur
const { data, error } = await supabase
  .from('users')
  .update({ is_active: false })
  .eq('id', userId)
```

#### Products

```typescript
// Récupérer produits avec variantes
const { data, error } = await supabase
  .from('products')
  .select(`
    *,
    brands (name),
    categories (name),
    product_variants (*)
  `)
  .eq('is_active', true)

// Créer un produit
const { data, error } = await supabase
  .from('products')
  .insert({
    name: 'Nike Air Max 270',
    description: 'Sneaker moderne...',
    brand_id: brandId,
    category_id: categoryId,
    base_price: 150.00,
    gender: 'homme'
  })
```

#### Orders

```typescript
// Créer une commande complète
const { data: order, error: orderError } = await supabase
  .from('orders')
  .insert({
    order_number: generateOrderNumber(),
    user_id: userId,
    status: 'confirmed',
    total_amount: total,
    shipping_address: addressData
  })
  .select()
  .single()

// Ajouter les articles
const orderItems = items.map(item => ({
  order_id: order.id,
  variant_id: item.variant.id,
  product_name: item.variant.product?.name,
  quantity: item.quantity,
  unit_price: item.variant.price,
  line_total: item.variant.price * item.quantity
}))

await supabase.from('order_items').insert(orderItems)

// Créer le paiement
await supabase.from('payments').insert({
  order_id: order.id,
  payment_method: 'stripe',
  status: 'completed',
  amount: total,
  transaction_id: `stripe_${Date.now()}`
})
```

#### Analytics & Statistics

```typescript
// Commandes par période
const { data } = await supabase
  .from('orders')
  .select('created_at, total_amount, status')
  .gte('created_at', startDate)
  .lte('created_at', endDate)

// Top produits
const { data } = await supabase
  .from('order_items')
  .select(`
    product_name,
    quantity,
    unit_price,
    line_total
  `)
  .order('quantity', { ascending: false })
  .limit(10)

// Stats utilisateurs
const { count } = await supabase
  .from('users')
  .select('*', { count: 'exact', head: true })
  .eq('role', 'customer')
```

## Row Level Security (RLS)

### Politiques Recommandées

```sql
-- Politique Users : Utilisateurs voient leurs propres données
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (id = auth.uid());

-- Politique Orders : Clients voient leurs commandes
CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT USING (user_id = auth.uid());

-- Politique Admin : Accès complet
CREATE POLICY "Admins have full access" ON users
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Politique Vendor : Accès aux commandes assignées
CREATE POLICY "Vendors can view assigned orders" ON orders
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'vendor' AND
    vendor_id = auth.uid()
  );
```

### État Actuel

```sql
-- RLS actuellement désactivé pour développement
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
-- etc.
```

## Gestion des Erreurs

### Patterns d'Erreur Standard

```typescript
// Pattern de gestion d'erreur Supabase
async function handleSupabaseOperation() {
  try {
    const { data, error } = await supabase.from('table').select()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Operation failed:', error)
    throw error
  }
}

// Pattern API Route
// api/example/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation
    if (!body.requiredField) {
      return Response.json(
        { success: false, error: 'Missing required field' },
        { status: 400 }
      )
    }

    // Operation
    const result = await someOperation(body)

    return Response.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('API Error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Authentification & Authorization

### Structure JWT (À implémenter)

```typescript
interface JWTPayload {
  sub: string        // user id
  email: string      // user email
  role: 'customer' | 'vendor' | 'admin'
  iat: number        // issued at
  exp: number        // expires at
}
```

### Middleware d'Auth (À implémenter)

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')

  // Vérifier routes protégées
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || !verifyAdminRole(token)) {
      return NextResponse.redirect('/login')
    }
  }

  if (request.nextUrl.pathname.startsWith('/vendeur')) {
    if (!token || !verifyVendorRole(token)) {
      return NextResponse.redirect('/login')
    }
  }
}
```

## Intégrations Externes

### Email (Nodemailer)

```typescript
// lib/email.ts
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

export async function sendOrderConfirmation(orderData: OrderData) {
  const htmlTemplate = generateOrderEmailTemplate(orderData)

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: orderData.customerEmail,
    subject: `Confirmation de commande ${orderData.orderNumber}`,
    html: htmlTemplate
  }

  return await transporter.sendMail(mailOptions)
}
```

### Stripe (Simulé)

```typescript
// lib/stripe.ts (simulation)
export function simulateStripePayment(amount: number, currency: string = 'EUR') {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `stripe_${Date.now()}`,
        status: 'completed',
        amount,
        currency
      })
    }, 2000) // Simule le délai de traitement
  })
}
```

## Rate Limiting (À implémenter)

```typescript
// lib/rate-limit.ts
import { LRUCache } from 'lru-cache'

const rateLimit = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
})

export function checkRateLimit(ip: string, limit: number = 10) {
  const tokenCount = (rateLimit.get(ip) as number[]) || [0]

  if (tokenCount[0] >= limit) {
    return false
  }

  tokenCount[0] += 1
  rateLimit.set(ip, tokenCount)
  return true
}
```

## Monitoring & Observability

### Logs Structurés

```typescript
// lib/logger.ts
interface LogEntry {
  level: 'info' | 'warn' | 'error'
  message: string
  context?: Record<string, any>
  timestamp: Date
  userId?: string
  requestId?: string
}

export function logOperation(entry: LogEntry) {
  console.log(JSON.stringify({
    ...entry,
    timestamp: entry.timestamp.toISOString()
  }))
}
```

### Métriques (À implémenter)

```typescript
// lib/metrics.ts
export class Metrics {
  static increment(metric: string, tags?: Record<string, string>) {
    // Implémenter avec service de métriques
    console.log(`Metric: ${metric}`, tags)
  }

  static timing(metric: string, duration: number) {
    console.log(`Timing: ${metric} = ${duration}ms`)
  }
}

// Utilisation
Metrics.increment('order.created', { status: 'success' })
Metrics.timing('api.response', 150)
```

## Tests API (À implémenter)

```typescript
// tests/api/orders.test.ts
describe('Orders API', () => {
  test('should create order successfully', async () => {
    const orderData = {
      items: [/* ... */],
      customerInfo: {/* ... */},
      shippingAddress: {/* ... */}
    }

    const response = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    })

    expect(response.status).toBe(201)
    const result = await response.json()
    expect(result.success).toBe(true)
    expect(result.data.orderNumber).toMatch(/^SH-\d+-[A-Z0-9]+$/)
  })
})
```

Cette documentation couvre l'ensemble des APIs et intégrations actuelles et futures du système SneakHouse.