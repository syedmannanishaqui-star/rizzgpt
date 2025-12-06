'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { User, Camera, Check, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '@/components/Header'

export default function SetupProfile() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    bio: '',
    age: '',
    gender: 'prefer_not_to_say',
    profilePicture: null as File | null,
  })

  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/')
    } else {
      checkIfProfileComplete()
    }
  }, [user])

  const checkIfProfileComplete = async () => {
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('username, age, gender, profile_picture_url')
      .eq('id', user.id)
      .single()

    if (data && data.username && data.age && data.gender) {
      // Profile already complete
      router.push('/feed')
    }
  }

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null)
      return
    }

    setCheckingUsername(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase())
      .single()

    setCheckingUsername(false)
    setUsernameAvailable(!data)
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setFormData({ ...formData, username: value })
    
    if (value.length >= 3) {
      const timeoutId = setTimeout(() => checkUsernameAvailability(value), 500)
      return () => clearTimeout(timeoutId)
    } else {
      setUsernameAvailable(null)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, profilePicture: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadProfilePicture = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user!.id}-${Date.now()}.${fileExt}`
      const filePath = `profile-pictures/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.username || formData.username.length < 3) {
      toast.error('Username must be at least 3 characters')
      return
    }

    if (!usernameAvailable) {
      toast.error('Username is not available')
      return
    }

    if (!formData.age || parseInt(formData.age) < 13) {
      toast.error('You must be at least 13 years old')
      return
    }

    if (!formData.profilePicture) {
      toast.error('Please upload a profile picture')
      return
    }

    setLoading(true)

    try {
      // Upload profile picture
      const profilePictureUrl = await uploadProfilePicture(formData.profilePicture)

      if (!profilePictureUrl) {
        toast.error('Failed to upload profile picture')
        setLoading(false)
        return
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username.toLowerCase(),
          full_name: formData.fullName || formData.username,
          bio: formData.bio,
          age: parseInt(formData.age),
          gender: formData.gender,
          profile_picture_url: profilePictureUrl,
        })
        .eq('id', user!.id)

      if (error) throw error

      toast.success('Profile created successfully!')
      router.push('/feed')
    } catch (error: any) {
      console.error('Error creating profile:', error)
      toast.error(error.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600">Set up your RizzNet profile to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full cursor-pointer hover:bg-pink-600 transition-colors">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">Upload profile picture *</p>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  @
                </span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={handleUsernameChange}
                  className="w-full pl-8 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="username"
                  required
                  minLength={3}
                  maxLength={30}
                />
                {checkingUsername && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500"></div>
                  </div>
                )}
                {!checkingUsername && usernameAvailable === true && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
                {!checkingUsername && usernameAvailable === false && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                )}
              </div>
              {usernameAvailable === false && (
                <p className="text-sm text-red-500 mt-1">Username is already taken</p>
              )}
              {usernameAvailable === true && (
                <p className="text-sm text-green-500 mt-1">Username is available!</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
                rows={3}
                maxLength={150}
              />
              <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/150</p>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="18"
                required
                min="13"
                max="120"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !usernameAvailable}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Profile...' : 'Complete Setup'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
