'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Loader2, Upload, Download, Sparkles, Image as ImageIcon } from 'lucide-react'

interface ProcessedImage {
  original: string
  processed: string
  bgRemoved: string
  width: number
  height: number
}

export default function MegaPhotoTool() {
  const [mode, setMode] = useState<'express' | 'preview'>('express')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null)
  const [lightingBoost, setLightingBoost] = useState([15])
  const [selectedSize, setSelectedSize] = useState('original')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const sizeOptions = [
    { value: 'original', label: 'Tamaño Original' },
    { value: '1000', label: '1000x1000' },
    { value: '2000', label: '2000x2000' },
    { value: '3000', label: '3000x3000' },
  ]

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      processImage(imageFile)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      processImage(file)
    }
  }, [])

  const enhanceLighting = (imageData: ImageData, boost: number): ImageData => {
    const pixels = imageData.data
    const factor = 1 + (boost / 100)
    
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = Math.min(255, pixels[i] * factor)     // Red
      pixels[i + 1] = Math.min(255, pixels[i + 1] * factor) // Green
      pixels[i + 2] = Math.min(255, pixels[i + 2] * factor) // Blue
      // Alpha channel (i + 3) remains unchanged
    }
    
    return imageData
  }

  const resizeImage = (canvas: HTMLCanvasElement, targetSize: string): HTMLCanvasElement => {
    if (targetSize === 'original') return canvas
    
    const size = parseInt(targetSize)
    const newCanvas = document.createElement('canvas')
    const ctx = newCanvas.getContext('2d')!
    
    newCanvas.width = size
    newCanvas.height = size
    
    ctx.drawImage(canvas, 0, 0, size, size)
    
    return newCanvas
  }

  const updatePreview = useCallback(async () => {
    if (!processedImage || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const enhancedData = enhanceLighting(imageData, lightingBoost[0])
      ctx.putImageData(enhancedData, 0, 0)
      
      const finalCanvas = resizeImage(canvas, selectedSize)
      setPreviewImage(finalCanvas.toDataURL('image/png'))
    }
    
    img.src = processedImage.bgRemoved
  }, [processedImage, lightingBoost, selectedSize])

  useEffect(() => {
    if (processedImage && mode === 'preview') {
      updatePreview()
    }
  }, [lightingBoost, selectedSize, processedImage, mode, updatePreview])

  const processImage = async (file: File) => {
    setIsProcessing(true)
    
    try {
      // Create image element
      const img = new Image()
      const originalUrl = URL.createObjectURL(file)
      
      img.onload = async () => {
        try {
          // Load background removal library
          const { removeBackground } = await import('@imgly/background-removal')
          
          // Remove background
          const blob = await removeBackground(file)
          const bgRemovedUrl = URL.createObjectURL(blob)
          
          // Create canvas for lighting enhancement
          const bgRemovedImg = new Image()
          bgRemovedImg.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!
            
            canvas.width = bgRemovedImg.width
            canvas.height = bgRemovedImg.height
            
            ctx.drawImage(bgRemovedImg, 0, 0)
            
            // Enhance lighting
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const enhancedData = enhanceLighting(imageData, lightingBoost[0])
            ctx.putImageData(enhancedData, 0, 0)
            
            // Resize if needed
            const finalCanvas = resizeImage(canvas, selectedSize)
            const processedUrl = finalCanvas.toDataURL('image/png')
            
            setProcessedImage({
              original: originalUrl,
              processed: processedUrl,
              bgRemoved: bgRemovedUrl,
              width: finalCanvas.width,
              height: finalCanvas.height
            })
            
            // Set preview for preview mode
            if (mode === 'preview') {
              setPreviewImage(processedUrl)
            }
            
            // Auto-download in express mode
            if (mode === 'express') {
              downloadImage(processedUrl, `megaphototool-${Date.now()}.png`)
            }
            
            setIsProcessing(false)
          }
          
          bgRemovedImg.src = bgRemovedUrl
        } catch (error) {
          console.error('Error de procesamiento:', error)
          setIsProcessing(false)
        }
      }
      
      img.src = originalUrl
    } catch (error) {
      console.error('Error al procesar imagen:', error)
      setIsProcessing(false)
    }
  }

  const downloadImage = (url: string, filename: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleDownload = () => {
    const imageUrl = mode === 'preview' && previewImage ? previewImage : processedImage?.processed
    if (imageUrl) {
      downloadImage(imageUrl, `megaphototool-${Date.now()}.png`)
    }
  }

  const handleProcessAnother = () => {
    setProcessedImage(null)
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-white relative font-sans">
      {/* Top Left Logo - Megazone */}
      <div className="absolute top-4 left-4 z-10">
        <img 
          src="/megazone-logo.png" 
          alt="Megazone Logo" 
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Top Right Logo - Megafood */}
      <div className="absolute top-4 right-4 z-10">
        <img 
          src="/megafood-logo.png" 
          alt="Megafood Logo" 
          className="h-12 w-auto object-contain"
        />
      </div>

      <div className="max-w-4xl mx-auto pt-20 px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-[4.5rem] font-black text-gray-900">MegaPhotoTool</h1>
          </div>
          
          {/* RoeschStudio Badge */}
          <div className="inline-flex items-center justify-center mb-4">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-black to-gray-600 text-white text-[0.85rem] font-medium border-2 border-black border-opacity-[0.085]">
              By RoeschStudio
            </div>
          </div>
          
          <p className="text-[1.75rem] font-bold text-gray-600 mb-2">Herramienta Gratuita de Mejora de Fotos de Producto</p>
          <p className="text-[0.85rem] font-normal text-gray-500">Elimina fondos • Mejora la iluminación • Redimensiona imágenes - 100% gratis</p>
        </div>

        {/* Company Attribution */}
        <div className="text-center mb-6">
          <p className="text-[0.85rem] font-normal text-gray-600">
            Esta aplicación está desarrollada para las empresas <span className="font-bold">Megazone</span> y <span className="font-bold">Megafood</span>
          </p>
          <p className="text-[0.85rem] font-normal text-gray-600">
            Creada por <span className="font-bold">Christopher Roesch</span>
          </p>
        </div>

        {/* Main Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Mode Selection */}
            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Modo de Procesamiento</Label>
              <RadioGroup value={mode} onValueChange={(value) => setMode(value as 'express' | 'preview')} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express" className="cursor-pointer">
                    <span className="font-medium">Express</span>
                    <span className="text-gray-500 ml-2 text-[0.85rem]">Procesamiento automático y descarga</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="preview" id="preview" />
                  <Label htmlFor="preview" className="cursor-pointer">
                    <span className="font-medium">Vista Previa</span>
                    <span className="text-gray-500 ml-2 text-[0.85rem]">Ver resultado antes de descargar</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator className="my-6" />

            {/* Upload Area */}
            {!processedImage && !isProcessing && (
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Suelta la Imagen Aquí
                </h3>
                <p className="text-gray-500 mb-4 text-[0.85rem]">o haz clic para explorar</p>
                <p className="text-sm text-gray-400 text-[0.85rem]">Soporta formatos JPG, PNG, WebP</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Procesando Imagen...</h3>
                <p className="text-gray-500 text-[0.85rem]">Eliminando fondo • Mejorando iluminación • Redimensionando</p>
              </div>
            )}

            {/* Preview Mode - Before/After */}
            {processedImage && mode === 'preview' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Antes</h4>
                    <div className="border rounded-lg overflow-hidden bg-gray-50">
                      <img 
                        src={processedImage.original} 
                        alt="Original" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Después</h4>
                    <div className="border rounded-lg overflow-hidden bg-gray-50">
                      <img 
                        src={previewImage || processedImage.processed} 
                        alt="Procesada" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Mejora de Iluminación: {lightingBoost[0]}%
                    </Label>
                    <Slider
                      value={lightingBoost}
                      onValueChange={setLightingBoost}
                      max={50}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Tamaño de Salida</Label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sizeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <Button onClick={handleDownload} className="flex items-center gap-2 text-[0.85rem] font-medium">
                    <Download className="w-4 h-4" />
                    Descargar PNG
                  </Button>
                  <Button variant="outline" onClick={handleProcessAnother} className="text-[0.85rem] font-medium">
                    Procesar Otra
                  </Button>
                </div>
              </div>
            )}

            {/* Express Mode - Simple Download */}
            {processedImage && mode === 'express' && (
              <div className="text-center py-8">
                <div className="mb-6">
                  <ImageIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">¡Imagen Procesada!</h3>
                  <p className="text-gray-500 text-[0.85rem]">Tu imagen mejorada ha sido descargada automáticamente.</p>
                  <p className="text-sm text-gray-400 mt-2 text-[0.85rem]">
                    Tamaño: {processedImage.width} × {processedImage.height}px • Formato: PNG
                  </p>
                </div>
                <Button onClick={handleProcessAnother} variant="outline" className="text-[0.85rem] font-medium">
                  Procesar Otra Imagen
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="text-center text-sm text-gray-500">
          <p className="text-[0.85rem] font-normal">✨ Gratis por siempre • Sin registro • Funciona en tu navegador • No se suben datos</p>
        </div>
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}