This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Decisiones tecnicas

Estilos:
- Se utiliza css modules para los estilos, para que los estilos sean locales y no afecten a otros componentes. 
- Utilizo variables de css para los colores y spacings, `variables.css`. En un proyecto tambien seria utilizado para fonts, radios, etc.
- Se utiliza una estrategia responsive con media queries y uso de rem.

Performance
- Se utiliza SWR para el fetching de datos, que maneja el cache de los datos y la revalidación de los datos.
- Se busca utilizar la menor cantidad de librerías en el cliente para reducir tamaño del bundle.
- Se mantiene el css a un mínimo. Buscaba incluir el criticalPath en el document pero por cuestiones de tiempo y haber usado turbo, no lo pude hacer funcionar.
- Para los llamados en el cliente se un proxy por la api del propio server para evitar handshake con dominio externo y tambien por seguridad evitamos exponer los servicios que consumimos. Asimismo permite a futuro. 
- No considere metricas como CLS por temas de tiempo, esto habria que mejorarlo
- Se utiliza el componente Link para hacer prefetch de la pagina de profile.

Accesibilidad
- Se utiliza `alt` para las imágenes
- Se utiliza `aria-label` para los botones
- Queda pendiente agregar `role` y `tabIndex` a los componentes.

Scaffolding:
- features: contiene los componentes base de la aplicacion. En este caso los features (listado y perfil) son de una sola página por lo que se mapea 1.1 con las pages.
- common: Contiene los componentes y funciones reutilizados entre features. Estos en un futuro podrian ser extraidos a una lib. 
- pages: directorio de Pages Router. Se desacopla el renderizado de los componentes de la logica especifica de Next para facilitar cambiar de estrategia de renderizado en un futuro.
- services: contiene los servicios que consumen las APIs externas. Esta pensado para ser extensible a futuro (e.g: Se agrega gitlab a la app).

Testing
- Los features son testeados con react testing library, haciendo tests de integración en el componente principal y tests unitarios en los componentes mas complejos como el Searchbar. Esto permite tener control sobre el feature sin estar acoplado a la implementación.
- Los common deberian contar con tests unitarios ya que son los componentes candidatos a ser extraidos a una lib. Por cuestiones de tiempo algunos no se implementaron.
- Los servicios son testeados con jest, utilizando mocks para simular las respuestas de las APIs.

Notas:
- No estoy muy convencido con el scaffolding de la app, los namings no me convencen. No tengo tiempo de refactorizar. 
- No abstraje componentes basicos como Button o Card. En una app real deberia haberse hecho.
- No se implemento una solucion de mocks, en una app productiva deberia hacerse para evitar bloqueos en desarrollo.
- No se agregan scripts de linting ni precommits. En una app productiva deberia haberse hecho.
- No estoy muy contento con el resultado final. La realidad es que quise construir una app productiva y no tengo el tiempo de hacerlo actualmente. Mentoreando 2 nuevos hires, entregando features y haciendo procesos. 

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
