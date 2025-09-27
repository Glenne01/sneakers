import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité - SneakHouse',
  description: 'Politique de confidentialité et protection des données personnelles de SneakHouse'
}

export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de confidentialité</h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              SneakHouse accorde une grande importance à la protection de vos données personnelles.
              Cette politique de confidentialité explique comment nous collectons, utilisons, partageons
              et protégeons vos informations personnelles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Données collectées</h2>
            <p>Nous collectons les types de données suivants :</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Informations d'identification (nom, prénom, email)</li>
              <li>Informations de livraison et de facturation</li>
              <li>Historique des achats et préférences</li>
              <li>Données de navigation sur notre site</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Traiter vos commandes et gérer votre compte</li>
              <li>Vous envoyer des communications marketing (avec votre consentement)</li>
              <li>Améliorer notre service client</li>
              <li>Personnaliser votre expérience d'achat</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits,
              contactez-nous à : privacy@sneakhouse.fr
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}