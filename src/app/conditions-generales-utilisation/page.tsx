import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions générales d\'utilisation - SneakHouse',
  description: 'Conditions générales d\'utilisation du site SneakHouse'
}

export default function ConditionsGeneralesUtilisation() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Conditions générales d'utilisation</h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Objet</h2>
            <p>
              Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation du site internet
              SneakHouse accessible à l'adresse www.sneakhouse.fr et de ses services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Acceptation des conditions</h2>
            <p>
              L'utilisation du site implique l'acceptation pleine et entière des présentes CGU.
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Utilisation du site</h2>
            <p>Vous vous engagez à :</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Utiliser le site conformément à sa destination</li>
              <li>Respecter les droits de propriété intellectuelle</li>
              <li>Ne pas perturber le fonctionnement du site</li>
              <li>Fournir des informations exactes lors de votre inscription</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Propriété intellectuelle</h2>
            <p>
              Tous les contenus du site (textes, images, logos, marques) sont protégés par des droits
              de propriété intellectuelle et appartiennent à SneakHouse ou à ses partenaires.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Responsabilité</h2>
            <p>
              SneakHouse met tout en œuvre pour assurer la disponibilité du site mais ne peut garantir
              un accès permanent. Nous ne saurions être tenus responsables des dommages résultant
              de l'utilisation ou de l'impossibilité d'utiliser le site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Modification des CGU</h2>
            <p>
              SneakHouse se réserve le droit de modifier les présentes CGU à tout moment.
              Les modifications prendront effet dès leur publication sur le site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact</h2>
            <p>
              Pour toute question concernant ces conditions d'utilisation,
              contactez-nous à : legal@sneakhouse.fr
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}