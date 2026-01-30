# Escáner de Precios PWA

Progressive Web App para escanear precios en supermercados usando la cámara y OCR.

# TODO
- Modificar seccion del input del nombre de la lista de compras para que sea un modal
- Advertencia de lista guardada podria ser un modal de la app.
- Buscar servidores gratis para el backend (Google Vision AI)

## 🚀 Características

- ✅ Escaneo de precios con cámara usando OCR (Tesseract.js)
- ✅ Entrada manual de precios
- ✅ Lista de productos en tiempo real
- ✅ Historial de compras con persistencia
- ✅ Diseño responsive para móviles
- ✅ PWA instalable
- ✅ Funcionamiento offline
- ✅ Tailwind CSS v4

## 📋 Requisitos previos

- Node.js 18+ 
- npm o yarn

## 🚀 Inicio Rápido

```bash
# 1. Clonar/crear el proyecto
npm create vite@latest price-scanner-pwa -- --template react
cd price-scanner-pwa

# 2. Instalar dependencias
npm install
npm install tesseract.js lucide-react
npm install -D tailwindcss@next vite-plugin-pwa

# 3. Copiar todos los archivos del proyecto

# 4. Configurar Florence-2 (OPCIONAL pero recomendado)
cp .env.example .env
# Edita .env y agrega tu Hugging Face API token

# 5. Crear estructura de carpetas
mkdir -p src/{components/{layout,scanner,history},hooks,services,utils,context}
mkdir -p public/icons

# 6. Probar configuración OCR (opcional)
# Abre test-ocr-setup.html en tu navegador

# 7. Ejecutar
npm run dev
```

**Nota importante:** Tailwind v4 está en fase beta, usa `tailwindcss@next` para obtener la última versión.

### 3. Configuración de Tailwind v4

**NO necesitas crear archivos de configuración** (`tailwind.config.js` ni `postcss.config.js`).

Tailwind v4 se configura directamente en:

1. **vite.config.js** - Ya incluye la configuración de PostCSS
2. **index.css** - Usa `@import "tailwindcss"` en lugar de las directivas `@tailwind`

### 4. Estructura de carpetas

Crear la siguiente estructura:

```bash
# Crear todas las carpetas necesarias
mkdir -p src/components/layout
mkdir -p src/components/scanner
mkdir -p src/components/history
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/context
mkdir -p public/icons
```

Estructura final:

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   └── Navigation.jsx
│   ├── scanner/
│   │   ├── CameraView.jsx
│   │   ├── PriceDetectionOverlay.jsx
│   │   ├── ManualPriceInput.jsx
│   │   └── CurrentItemsList.jsx
│   └── history/
│       ├── HistoryView.jsx
│       ├── SessionCard.jsx
│       └── EmptyHistoryState.jsx
├── hooks/
│   ├── useCamera.js
│   └── useOCR.js
├── services/
│   ├── ocrService.js
│   └── priceParser.js
├── context/
│   └── ShoppingContext.jsx
├── App.jsx
├── index.jsx
└── index.css
```

### 5. Copiar los archivos

Copiar todos los archivos proporcionados en sus respectivas ubicaciones según la estructura de carpetas.

**IMPORTANTE:** El archivo `index.css` debe usar `@import "tailwindcss"` (ya actualizado en los archivos).

### 6. Crear iconos para PWA

Necesitas crear iconos en estos tamaños en `public/icons/`:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

**Opciones para generar iconos:**

**Opción A - Generador Online (Más fácil):**
1. Ve a: https://www.pwabuilder.com/imageGenerator
2. Sube un logo de al menos 512x512px
3. Descarga todos los iconos
4. Colócalos en `public/icons/`

**Opción B - Manualmente:**
Consulta el archivo `GUIA_GENERAR_ICONOS.md` para instrucciones detalladas.

**Iconos temporales para testing:**
Si solo quieres probar, puedes usar iconos placeholder. La app funcionará sin ellos pero Chrome mostrará advertencias.

## 🎮 Uso

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para producción

```bash
npm run build
npm run preview
```

## 📱 Instalación como PWA

### En Móvil (Chrome/Edge)

1. Abre la app en el navegador
2. Aparecerá automáticamente un **banner de instalación** en la parte inferior
3. Toca **"Instalar"** en el banner
4. O manualmente: Menú (⋮) > "Agregar a pantalla de inicio"
5. La app se instalará como una aplicación nativa

### En Desktop (Chrome/Edge)

1. Abre la app en el navegador
2. Busca el ícono de **instalación** (➕) en la barra de direcciones
3. O el banner flotante con el botón "Instalar"
4. Click en "Instalar"
5. La app se abrirá en su propia ventana

### Verificar instalación

Para verificar que la PWA funciona:

```bash
# Build de producción
npm run build
npm run preview
```

Luego:
1. Abre DevTools (F12)
2. Application > Manifest
3. Verifica que todos los iconos aparezcan
4. Application > Service Workers
5. Verifica que el Service Worker esté registrado

### Características PWA

Una vez instalada:
- ✅ Icono en pantalla de inicio
- ✅ Abre en ventana propia (sin barra del navegador)
- ✅ Funciona offline (historial y datos guardados)
- ✅ Notificaciones (próximamente)
- ✅ Acceso rápido desde home screen

## 🔧 Configuración del OCR

La app utiliza un **sistema híbrido de OCR** con 3 métodos:

### 1. **Florence-2** (Recomendado - Más preciso) 🎯
- 95% de precisión en precios
- 2-3 segundos de procesamiento
- Requiere API key GRATUITA de Hugging Face

**Configuración (5 minutos):**
```bash
# 1. Obtén tu API key gratis:
# https://huggingface.co/settings/tokens

# 2. Crea archivo .env en la raíz:
echo "VITE_HF_API_KEY=hf_tu_token_aqui" > .env

# 3. Reinicia el servidor
npm run dev
```

Ver guía completa: `CONFIGURAR_FLORENCE2.md`

### 2. **OCR.space** (Fallback automático) 🌐
- 85% de precisión
- 3-5 segundos
- 25,000 requests/mes gratis
- No requiere configuración

### 3. **Tesseract** (Offline) 📖
- 60% de precisión
- 10-15 segundos
- 100% offline y gratis
- No requiere configuración

**El sistema prueba los métodos en orden automáticamente. Si uno falla, usa el siguiente.**

### Cambiar idioma (solo Tesseract):
En `ocrService.js`:
```javascript
this.worker = await Tesseract.createWorker('spa', 1, {
  // 'spa' = español, 'eng' = inglés, 'por' = portugués
});
```

## 🎯 Funcionalidades principales

### Escanear precio
1. Click en "Activar Cámara"
2. Centra el precio en el recuadro azul
3. Click en "Escanear Precio"
4. **Si detecta un precio:** Confirma o rechaza
5. **Si detecta múltiples precios:** Selecciona el correcto de la lista
   - El sistema muestra badges de "Más alto", "Más bajo", "Repetido"
   - Puedes elegir el precio correcto o cancelar si ninguno es válido

### Agregar manualmente
1. Click en "Agregar precio manualmente"
2. Ingresa el precio
3. Click en "Agregar"

### Ver historial
1. Click en pestaña "Historial"
2. Expande cualquier compra para ver detalles
3. Elimina compras con el ícono de papelera

## 🐛 Troubleshooting

### La cámara no funciona
- Asegúrate de dar permisos de cámara al navegador
- En producción, la PWA debe estar en HTTPS
- Prueba en Chrome/Edge (mejor soporte)

### El OCR no detecta precios
- Asegura buena iluminación
- Mantén la cámara estable
- El precio debe estar enfocado y legible
- Usa la entrada manual como backup

### Los datos no se guardan
- Verifica que localStorage esté habilitado
- No uses modo incógnito
- Revisa la consola del navegador para errores

### Error con Tailwind v4
Si tienes problemas:
- Asegúrate de tener `@import "tailwindcss"` en `index.css` (NO uses `@tailwind`)
- Verifica que `vite.config.js` tenga la configuración de PostCSS con tailwindcss
- NO crees archivos `tailwind.config.js` ni `postcss.config.js` separados (no son necesarios en v4)
- Si necesitas personalizar Tailwind v4, usa `@theme` en tu CSS

## 📦 Deploy

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### GitHub Pages
```bash
npm run build
# Sube la carpeta dist/ a tu repositorio
```

## 🔐 HTTPS en desarrollo local

Para probar la cámara en desarrollo local con HTTPS:

```bash
npm install -D @vitejs/plugin-basic-ssl
```

Actualizar `vite.config.js`:
```javascript
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: { https: true }
})
```

## 🎨 Personalización con Tailwind v4

Si quieres personalizar colores, fuentes, etc., agrégalos en `index.css` usando `@theme`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #4f46e5;
  --font-sans: "Inter", system-ui;
}
```

## 🤝 Contribuciones

Las mejoras son bienvenidas. Algunas ideas:

- [ ] Soporte para múltiples monedas
- [ ] Exportar historial a CSV
- [ ] Categorización de productos
- [ ] Comparación de precios entre supermercados
- [ ] Estadísticas y gráficos
- [ ] Modo oscuro
- [ ] Integración con listas de compras

## 📄 Licencia

MIT

## 👨‍💻 Autor

Desarrollado con ❤️ para facilitar las compras en supermercados

---

## 📝 Comandos de instalación completos (copiar y pegar)

```bash
# Crear proyecto
npm create vite@latest price-scanner-pwa -- --template react
cd price-scanner-pwa

# Instalar todas las dependencias
npm install
npm install tesseract.js lucide-react
npm install -D tailwindcss@next vite-plugin-pwa

# Crear estructura de carpetas
mkdir -p src/components/layout
mkdir -p src/components/scanner
mkdir -p src/components/history
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/context
mkdir -p public/icons

# Ahora copia todos los archivos en sus ubicaciones
# y ejecuta:
npm run dev
```

## 🔑 Diferencias clave Tailwind v4

- ✅ **NO necesitas** `tailwind.config.js`
- ✅ **NO necesitas** `postcss.config.js` separado
- ✅ Usa `@import "tailwindcss"` en lugar de `@tailwind`
- ✅ Configuración en `vite.config.js`
- ✅ Personalización con `@theme` en CSS