# CarPlace

Un proyecto de ejemplo construido con Next.js, TypeScript y Clerk para autenticación, incluyendo un pipeline de CI/CD con GitHub Actions y despliegue en Vercel.

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
4. Lanza el servidor de desarrollo:
   ```bash
   npm run dev
   ```

Para los builds de producción, estos pueden ser vistos desde Vercel.

## Examples

- **Health-check API**: Visita [`/api/health`](http://localhost:3000/api/health) para verificar que el backend responde con `{ status: "ok" }`.
- **Páginas protegidas**: Cualquier página que use Clerk requiere autenticación; revisa `app/dashboard/page.tsx` como ejemplo.

## Troubleshooting

- **Error de importación `@/...`**: Asegúrate de tener el alias configurado en `tsconfig.json` y en `vite.config.ts` (o `vitest.config.ts`).
- **Vitest sin tests**: Crea un archivo `tests/example.test.ts` con un test simple (por ejemplo, `1 + 1 = 2`) para asegurarte de que funciona.
- **Husky o lint-staged no bloquea commits**: Revisa tu `.husky/pre-commit` y la configuración en `package.json`; usa `eslint --cache --fix` con `--max-warnings 0`.

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
