# CarPlace
Un proyecto de ejemplo construido con Next.js, TypeScript y Clerk para autenticación, incluyendo un pipeline de CI/CD con GitHub Actions y despliegue en Vercel.

## Features
- **Autenticación**: Integración con Clerk para manejar usuarios autenticados y no autenticados.
- **Base de datos**: Configuración con Prisma y PostgreSQL, incluyendo un esquema detallado para manejar marcas, modelos, versiones y listados de autos.
- **Estilos**: Uso de Tailwind CSS con soporte para `tailwind-merge` y variantes personalizadas.
- **Testing**: Configuración con Vitest y Testing Library para pruebas unitarias y de snapshot.
- **Cobertura de código**: Reportes de cobertura configurados con Vitest y GitHub Actions.
- **Linter y formateo**: ESLint y Prettier configurados con reglas personalizadas.
- **Pipeline CI/CD**: Workflows de GitHub Actions para pruebas, linting, análisis de seguridad con CodeQL y detección de código no utilizado con Knip.
- **Componentes reutilizables**: Biblioteca de componentes UI como botones, inputs, filtros, y más.
- **Páginas dinámicas**: Soporte para rutas dinámicas como `/cars/[id]`.

## Installation
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/carplace.git
   cd carplace
   ```
2. Instala las dependencias:
   ```bash
   npm i
   ```
3. Configura las variables de entorno definidas en `.env.example`:
```bash
   cp .env.example .env
```
4. Genera el cliente de Prisma:
   ```bash
   npx prisma generate
   ```
5. Ejecuta las migraciones de Prisma:
   ```bash
   npx prisma migrate dev
   ```
6. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
7. Abre tu navegador y visita `http://localhost:3000`.

Para los builds de producción, estos pueden ser vistos desde Vercel.

## Troubleshooting
- **Error de importación `@/...`**: Asegúrate de tener el alias configurado en `tsconfig.json` y en `vite.config.ts` (o `vitest.config.ts`).
- **Vitest sin tests**: Crea un archivo `tests/example.test.ts` con un test simple (por ejemplo, `1 + 1 = 2`) para asegurarte de que funciona.
- **Husky o lint-staged no bloquea commits**: Revisa tu `.husky/pre-commit` y la configuración en `package.json`; usa `eslint --cache --fix` con `--max-warnings 0`.

## Testing
Para ejecutar las pruebas, usa:
```bash
npm run test
```
Para generar un reporte de cobertura, usa:
```bash
npm run test:coverage
```

## Scripts
- `dev`: Inicia el servidor de desarrollo con soporte para Turbopack.
- `build`: Genera el build de producción.
- `start`: Inicia el servidor de producción.
- `lint`: Ejecuta ESLint en el código.
- `lint:fix`: Ejecuta ESLint y corrige automáticamente los problemas.
- `test`: Ejecuta Vitest para pruebas unitarias.
- `test:coverage`: Ejecuta Vitest y genera un reporte de cobertura.
- `prepare`: Configura Husky para hooks de Git.
- `knip` Detecta código no utilizado en el proyecto.

## API Endpoints
- `GET /api/health`: Verifica el estado del backend.
- `GET /api/brands`: Obtiene la lista de marcas de autos.
- `GET /api/hello`: Devuelve un saludo.

## CI/CD
El pipeline de CI/CD incluye:
- **Pruebas y cobertura**: Ejecuta pruebas con Vitest y compara la cobertura con la rama principal.
- **Lintig**: Verifica errores de estilo con ESLint.
- **Análisis de seguridad**: Escanea el código en busca de vulnerabilidades con CodeQL.
- **Knip**: Detecta código no utilizado en el proyecto.
- **Despliegue**: Despliega automáticamente en Vercel al hacer push a la rama de release.

## Changelog
El historial de cambios se encuentra en la lista de [releases de GitHub](https://github.com/Carplace-code/carplace/releases).

## Additional Resources
- [Clerk](https://clerk.com)
- [Vercel](https://vercel.com)

## License Information
Este proyecto está licenciado bajo la licencia MIT.
```
MIT License

Copyright (c) 2025 Carplace

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
