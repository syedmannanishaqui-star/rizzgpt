'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image as ImageIcon, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void
  onTextExtracted: (text: string) => void
}

export default function ImageUploader({ onImageUpload, onTextExtracted }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
      onImageUpload(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Extract text from image
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (data.success) {
        onTextExtracted(data.text)
        toast.success('Chat screenshot analyzed!')
      } else {
        toast.error('Failed to extract text from image')
      }
    } catch (error) {
      console.error('Error extracting text:', error)
      toast.error('Error processing image')
    } finally {
      setIsProcessing(false)
    }
  }, [onImageUpload, onTextExtracted])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
  })

  const clearImage = () => {
    setPreview(null)
    onImageUpload('')
    onTextExtracted('')
  }

  return (
    <div className="w-full">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-300 hover:border-pink-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          {isDragActive ? (
            <p className="text-lg text-pink-500 font-medium">Drop your screenshot here...</p>
          ) : (
            <>
              <p className="text-lg text-gray-700 font-medium mb-2">
                Drop your chat screenshot here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse (PNG, JPG, JPEG, WebP)
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
            <img
              src={preview}
              alt="Chat screenshot"
              className="w-full h-auto max-h-96 object-contain bg-gray-50"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                  <p className="text-sm text-gray-700 mt-2">Analyzing chat...</p>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
