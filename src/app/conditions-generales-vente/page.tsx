import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions générales de vente - SneakHouse',
  description: 'Conditions générales de vente de SneakHouse'
}

export default function ConditionsGeneralesVente() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Conditions générales de vente</h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Champ d'application</h2>
            <p>
              Les présentes conditions générales de vente (CGV) s'appliquent à toutes les ventes
              de produits effectuées par SneakHouse sur son site internet.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Produits</h2>
            <p>
              Les produits proposés sont des sneakers neuves et authentiques des marques partenaires.
              Les photos et descriptions sont les plus fidèles possibles mais peuvent présenter
              de légères variations avec le produit réel.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Prix</h2>
            <p>Concernant les prix :</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Les prix sont indiqués en euros, toutes taxes comprises</li>
              <li>Les frais de livraison sont indiqués avant validation de la commande</li>
              <li>SneakHouse se réserve le droit de modifier ses prix à tout moment</li>
              <li>Le prix applicable est celui en vigueur au moment de la commande</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Commande</h2>
            <p>
              Pour passer commande, vous devez être majeur ou avoir l'autorisation de votre
              représentant légal. La commande est définitive après validation du paiement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Paiement</h2>
            <p>Le paiement s'effectue :</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Par carte bancaire (Visa, Mastercard, American Express)</li>
              <li>Par PayPal</li>
              <li>Par virement bancaire</li>
            </ul>
            <p className="mt-2">
              Les paiements sont sécurisés et vos données bancaires ne sont pas conservées.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Livraison</h2>
            <p>
              Les livraisons sont effectuées en France métropolitaine et en Europe.
              Les délais de livraison sont de 3 à 7 jours ouvrés selon la destination.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Droit de rétractation</h2>
            <p>
              Vous disposez d'un délai de 14 jours pour retourner votre commande sans motif.
              Les produits doivent être dans leur état d'origine avec leur emballage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Garantie</h2>
            <p>
              Tous nos produits bénéficient de la garantie légale de conformité et de la
              garantie contre les vices cachés.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact</h2>
            <p>
              Pour toute question concernant vos commandes ou ces conditions de vente,
              contactez notre service client : ventes@sneakhouse.fr
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}