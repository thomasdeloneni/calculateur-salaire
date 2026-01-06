export const metadata = {
  title: 'Calculateur Salaire Assistante Maternelle',
  description: 'Calcul rapide du salaire mensuel',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
