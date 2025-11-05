# 📸 MegaPhotoTool by RoeschStudio

Herramienta gratuita de mejora de fotos de producto desarrollada para las empresas **Megazone** y **Megafood**, creada por **Christopher Roesch** de **RoeschStudio**.

## ✨ Características

- **🎯 Eliminación de Fondo** - Usa @imgly/background-removal (se ejecuta en el navegador, sin API)
- **💡 Mejora de Iluminación** - Aumento de brillo del 15% usando Canvas API
- **📏 Redimensionamiento de Imágenes** - Presets comunes: 1000x1000, 2000x2000, 3000x3000 píxeles
- **⚡ Dos Modos**:
  - **Modo Express**: Procesamiento automático y descarga
  - **Modo Vista Previa**: Ver antes/después, ajustar configuraciones
- **🌐 100% Gratis** - Sin costos de servidor, sin tarifas de API, sin registro
- **🔒 Privado** - Todo el procesamiento ocurre en tu navegador
- **📱 Responsivo** - Funciona en escritorio y móvil
- **🎨 Vista Previa en Tiempo Real** - Ajuste de iluminación con preview instantáneo

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir http://localhost:3000
```

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui (estilo New York)
- **Eliminación de Fondo**: @imgly/background-removal (AI basada en navegador, gratis)
- **Procesamiento de Imágenes**: HTML5 Canvas API (integrado en navegadores)
- **Manejo de Archivos**: File API (integrado en navegadores)
- **Tipografía**: Geist (font-sans)
- **Empresas**: Megazone, Megafood (clientes) / RoeschStudio (desarrollo)

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx          # Aplicación principal MegaPhotoTool
│   ├── layout.tsx        # Layout de la app
│   └── globals.css       # Estilos globales
├── components/ui/        # Componentes shadcn/ui
└── lib/                  # Funciones de utilidad
public/
├── megazone-logo.png     # Logo de Megazone
└── megafood-logo.png     # Logo de Megafood
```

## 🎯 Cómo Funciona

### Modo Express
1. Arrastra o selecciona una imagen
2. Procesamiento automático (2-5 segundos):
   - Eliminación de fondo
   - Mejora de iluminación del 15%
   - Redimensionamiento a dimensiones seleccionadas
3. Descarga automática de archivo PNG

### Modo Vista Previa
1. Arrastra o selecciona una imagen
2. Ver comparación antes/después
3. Ajustar configuraciones:
   - Slider de mejora de iluminación (0-50%) con preview en tiempo real
   - Selección de tamaño (original, 1000x1000, 2000x2000, 3000x3000)
4. Descargar cuando estés satisfecho

## 🎨 Diseño y Personalización

### Tipografía (Geist)
- **Títulos**: 4.5rem, font-weight: 900
- **Subtítulos**: 1.75rem, font-weight: 700
- **Párrafos**: 0.85rem, font-weight: 400
- **Botones**: 0.85rem, font-weight: 500

### Branding
- **Logo Megazone**: Esquina superior izquierda
- **Logo Megafood**: Esquina superior derecha
- **Badge RoeschStudio**: Gradiente negro a gris, texto blanco, borde 2px negro con opacidad 0.085

### Características de Diseño
- Interfaz limpia y minimalista
- Upload con drag & drop
- Feedback en tiempo real del procesamiento
- Comparación antes/después en modo vista previa
- Diseño responsivo para todos los dispositivos
- Estilizado profesional con Tailwind CSS

## 🔧 Procesamiento de Imágenes

### Eliminación de Fondo
```javascript
import { removeBackground } from '@imgly/background-removal';
const blob = await removeBackground(imageFile);
```

### Mejora de Iluminación
```javascript
// Manipulación de píxeles Canvas - aumento 15% brillo
const factor = 1.15;
pixels[i] = Math.min(255, pixels[i] * factor);
```

### Redimensionamiento
```javascript
// Método Canvas drawImage para redimensionar
ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
```

### Preview en Tiempo Real
```javascript
// Actualización dinámica con slider
useEffect(() => {
  if (processedImage && mode === 'preview') {
    updatePreview();
  }
}, [lightingBoost, selectedSize, processedImage, mode, updatePreview]);
```

## 🌍 Opciones de Hosting Gratuitas

Despliega en cualquiera de estas opciones (todas gratis):
- **GitHub Pages**: Sube código, habilita pages, listo
- **Netlify**: Arrastra y suelta tu carpeta
- **Vercel**: Conecta repo, auto-despliegue
- **Cloudflare Pages**: Gratis, CDN rápido

## 📋 Formatos Soportados

- **Entrada**: JPG, PNG, WebP
- **Salida**: PNG (con transparencia)

## 🎨 Características de Diseño

- Interfaz limpia y minimalista
- Upload con drag & drop
- Feedback de procesamiento en tiempo real
- Comparación antes/después en modo vista previa
- Diseño responsivo para todos los dispositivos
- Estilizado profesional con Tailwind CSS
- Preview en tiempo real del ajuste de iluminación

## 🔒 Privacidad y Seguridad

- **100% Cliente-side** - No se suben imágenes a servidores
- **Sin registro** - Comienza a usar inmediatamente
- **Sin seguimiento** - Tus imágenes permanecen privadas
- **Funciona offline** - Una vez cargado, no se necesita internet

## 📊 Rendimiento

- **Tiempo de procesamiento**: 2-5 segundos para la mayoría de imágenes
- **Límite de tamaño de archivo**: Dependiente del navegador (típicamente 10-50MB)
- **Navegadores soportados**: Chrome, Firefox, Safari, Edge (versiones modernas)

## 🏢 Empresas

### Clientes
- **Megazone**: Empresa líder en soluciones tecnológicas
- **Megafood**: Empresa especializada en productos alimenticios

### Desarrollo
- **RoeschStudio**: Agencia de desarrollo web y diseño
- **Christopher Roesch**: Desarrollador principal y creador de la herramienta

## 🤝 Contribuyendo

Esta es una herramienta simple y enfocada. Para reportes de errores o solicitudes de características, por favor crea un issue.

## 📄 Licencia

MIT License - Gratis para usar, modificar y distribuir.

---

**Desarrollado para Megazone y Megafood por RoeschStudio** • **Creado por Christopher Roesch** • **Costo total: $0 por siempre** 🎯