import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de cookies - SneakHouse',
  description: 'Politique d\'utilisation des cookies sur SneakHouse'
}

export default function PolitiqueCookies() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de cookies</h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
            <p>
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone)
              lors de la visite d'un site web. Il permet au site de reconnaître votre terminal lors de vos
              visites ultérieures et d'améliorer votre expérience de navigation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Types de cookies utilisés</h2>

            <h3 className="text-lg font-medium text-gray-800 mb-2 mt-6">Cookies strictement nécessaires</h3>
            <p>
              Ces cookies sont indispensables au fonctionnement du site. Ils permettent l'utilisation
              des principales fonctionnalités comme la navigation, l'accès aux zones sécurisées et
              la gestion du panier d'achat.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mb-2 mt-6">Cookies de performance</h3>
            <p>
              Ces cookies nous aident à comprendre comment les visiteurs utilisent notre site en
              collectant des informations anonymes sur les pages visitées et les erreurs rencontrées.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mb-2 mt-6">Cookies de fonctionnalité</h3>
            <p>
              Ces cookies permettent au site de mémoriser vos préférences (langue, région, préférences
              d'affichage) pour vous offrir une expérience personnalisée.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mb-2 mt-6">Cookies publicitaires</h3>
            <p>
              Ces cookies sont utilisés pour vous proposer des publicités pertinentes et limiter
              le nombre de fois où vous voyez une publicité.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Gestion de vos préférences</h2>
            <p>
              Vous pouvez à tout moment modifier vos préférences concernant les cookies :
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Via notre bandeau de gestion des cookies présent sur le site</li>
              <li>En configurant votre navigateur web</li>
              <li>En nous contactant directement</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Configuration par navigateur</h2>
            <p>
              Vous pouvez configurer votre navigateur pour accepter ou refuser les cookies :
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li><strong>Chrome :</strong> Paramètres &gt; Confidentialité et sécurité &gt; Cookies</li>
              <li><strong>Firefox :</strong> Préférences &gt; Vie privée et sécurité</li>
              <li><strong>Safari :</strong> Préférences &gt; Confidentialité</li>
              <li><strong>Edge :</strong> Paramètres &gt; Cookies et autorisations de site</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Cookies tiers</h2>
            <p>
              Notre site utilise des services tiers qui peuvent déposer leurs propres cookies :
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Google Analytics (analyse d'audience)</li>
              <li>Facebook Pixel (publicité ciblée)</li>
              <li>Services de paiement sécurisé</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Durée de conservation</h2>
            <p>
              Les cookies ont une durée de vie limitée :
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Cookies de session : supprimés à la fermeture du navigateur</li>
              <li>Cookies persistants : conservés jusqu'à 13 mois maximum</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact</h2>
            <p>
              Pour toute question concernant notre utilisation des cookies,
              contactez-nous à : cookies@sneakhouse.fr
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}