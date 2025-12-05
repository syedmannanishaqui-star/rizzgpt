# RizzGPT 🔥

AI-powered chat response generator that helps you craft flirty, charismatic replies with multiple tone options. Now with user authentication and conversation history!

![RizzGPT](https://img.shields.io/badge/Status-Live-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### Core Features
- 📸 **Screenshot Upload** - Upload chat screenshots with drag & drop
- 🤖 **AI-Powered** - Uses Google Gemini for intelligent text extraction and response generation
- 🎯 **4 Tone Levels** - Subtle, Moderate, Bold, Very Bold
- 💬 **Multiple Responses** - Get 4 different response options per generation
- 📋 **Easy Copy** - One-click copy to clipboard

### New Features ⭐
- 🔐 **User Authentication** - Email/password and Google OAuth sign-in
- 📚 **Conversation History** - Automatically saves all your conversations
- ⭐ **Favorite Responses** - Mark and save your best responses
- 🗑️ **Manage History** - View, favorite, and delete past conversations
- 🎨 **Beautiful UI** - Modern, responsive design with smooth animations
- 🆓 **Completely Free** - No subscriptions, no paywalls

## 🚀 Quick Start

### For Users

1. Visit the live app: **[RizzGPT](https://rizzgpt.vercel.app)** *(deploy first to get URL)*
2. Sign up for a free account
3. Upload a chat screenshot
4. Choose your tone
5. Get AI-generated responses!

### For Developers

See **[SETUP.md](./SETUP.md)** for complete deployment instructions.

**Quick local setup:**

```bash
# Clone the repo
git clone https://github.com/syedmannanishaqui-star/rizzgpt.git
cd rizzgpt

# Install dependencies
npm install

# Set up environment variables (see .env.example)
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: Google Gemini (Vision + Text Generation)
- **Authentication**: Supabase Auth (Email + OAuth)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **UI Components**: Lucide React, React Hot Toast, React Dropzone

## 📋 Environment Variables

```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🗄️ Database Schema

The app uses three main tables:

- **profiles** - User profile information
- **conversations** - Saved chat contexts and metadata
- **responses** - AI-generated responses with favorite status

See `supabase/schema.sql` for the complete schema.

## 📱 How It Works

1. **Upload** - User uploads a chat screenshot
2. **Extract** - Google Gemini Vision extracts text from the image
3. **Select Tone** - User chooses desired response tone
4. **Generate** - AI generates 4 contextual responses
5. **Save** - Conversation automatically saved to database (if logged in)
6. **Copy** - User copies their favorite response

## 🎨 Tone Levels

- **Subtle** 😊 - Friendly, warm, light teasing
- **Moderate** 😏 - Playful, confident, charming
- **Bold** 😎 - Direct, flirty, charismatic
- **Very Bold** 🔥 - Maximum rizz, smooth moves

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Secure authentication with Supabase
- API keys stored in environment variables
- User data isolated and protected

## 📈 Roadmap

- [x] User authentication
- [x] Conversation history
- [x] Favorite responses
- [ ] Share responses with friends
- [ ] Custom tone creation
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Response analytics
- [ ] Team collaboration features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini for powerful AI capabilities
- Supabase for authentication and database
- Vercel for seamless deployment
- The open-source community

## 📞 Support

- 📧 Email: support@rizzgpt.com *(update with your email)*
- 🐛 Issues: [GitHub Issues](https://github.com/syedmannanishaqui-star/rizzgpt/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/syedmannanishaqui-star/rizzgpt/discussions)

## ⭐ Show Your Support

If you like this project, give it a ⭐️ on GitHub!

---

**Made with ❤️ for smooth talkers everywhere**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/syedmannanishaqui-star/rizzgpt)
