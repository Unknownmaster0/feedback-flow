# 🚀 Feedback-app

<div align="center">

**A modern feedback collection platform for developers, students, and professionals**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-4F46E5?style=for-the-badge)](https://feedback-app-pi-two.vercel.app/)
[![GitHub](https://img.shields.io/badge/📂_GitHub-181717?style=for-the-badge&logo=github)](https://github.com/Unknownmaster0/feedback-app/)

</div>

---

## 📋 Table of Contents
- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📱 Usage Guide](#-usage-guide)
- [🎨 Screenshots](#-screenshots)
- [🔮 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [👨‍💻 Author](#-author)
- [📄 License](#-license)

---

## 🎯 Overview

**Feedback-app** is a comprehensive feedback collection platform designed to bridge the gap between feedback providers and recipients. Built with modern web technologies, it enables seamless anonymous feedback collection, AI-powered suggestions, and easy integration into personal portfolios and professional websites.

### 🎭 The Problem
- Students and developers lack simple tools to collect user feedback on their projects
- Existing feedback solutions are either too complex or too basic
- No easy way to showcase received feedback on personal websites

### 💡 The Solution
Feedback-app provides a personalized feedback collection system with:
- **One-click setup** - Get your unique feedback URL instantly
- **AI-powered assistance** - Smart suggestions help users write better feedback
- **Seamless integration** - Embeddable widgets for any website
- **Export capabilities** - Download and use your feedback data anywhere

---

## ✨ Features

### 🔥 Core Features
- **🌐 Public Profile URLs** - Unique, shareable links for feedback collection
- **🤖 AI-Powered Suggestions** - Intelligent feedback prompts using Cohere AI
- **👤 Anonymous Collection** - Optional anonymous feedback submission
- **📊 Export Functionality** - Download feedback data in multiple formats
- **🎨 Embeddable Widgets** - Showcase feedback on your website
- **🔐 Secure Authentication** - NextAuth.js powered user management

### 🚧 Coming Soon
- **📈 Analytics Dashboard** - Track feedback trends and insights  
- **🎯 Feedback Categories** - Organize feedback by type and purpose
- **👥 Team Collaboration** - Multi-user feedback management
- **🎨 Custom Branding** - Personalize your feedback pages
- **📱 Mobile App** - Native mobile experience
- **⚡ Real-time Notifications** - Instant feedback alerts

---

## 🛠️ Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### Backend
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)

### UI/UX
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_Icons-F56565?style=for-the-badge&logo=lucide&logoColor=white)
![FontAwesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=for-the-badge&logo=fontawesome&logoColor=white)

### AI & Integration
![Cohere](https://img.shields.io/badge/Cohere_AI-FF6B6B?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 18.0.0
MongoDB (local or cloud)
Yarn or npm package manager
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Unknownmaster0/feedback-app.git
   cd feedback-app
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_super_secret_key
   
   # AI Integration
   COHERE_API_KEY=your_cohere_api_key
   
   # Email (Optional)
   EMAIL_SERVER_USER=your_email@example.com
   EMAIL_SERVER_PASSWORD=your_email_password
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_FROM=noreply@feedbackflow.com
   ```

4. **Start the development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🐳 Docker Setup (Optional)
```bash
# Build and run with Docker
docker-compose up --build

# Or use the provided Dockerfile
docker build -t feedbackflow .
docker run -p 3000:3000 feedbackflow
```

---

## 📱 Usage Guide

### 🔰 Getting Started
1. **Sign Up** - Create your account using email or OAuth providers
2. **Get Your URL** - Receive your unique feedback collection link
3. **Share Your Link** - Add it to your portfolio, email signature, or social media
4. **Receive Feedback** - Monitor incoming feedback in your dashboard

### 💬 Sending Feedback
1. **Visit a Profile** - Click on any public profile or use a shared link
2. **Write Feedback** - Use the rich text editor or AI suggestions
3. **Choose Privacy** - Send anonymously or with your name
4. **Submit** - Your feedback is delivered instantly

### 🎨 Embedding Widgets
```html
<!-- Add to your website -->
<div id="feedbackflow-widget" data-user="your-username"></div>
<script src="https://feedback-app-pi-two.vercel.app/embed.js"></script>
```

### 📊 Exporting Data
- **JSON Format** - For developers and integrations
- **CSV Format** - For spreadsheets and analysis
- **PDF Reports** - For presentations and portfolios

---

## 🎨 Screenshots

### 🏠 Homepage
![Homepage](https://drive.google.com/uc?export=view&id=1XrH4vNlHjuIPz2dFDkpxrMTLBE_YwVPx)

### 📝 Feedback Form
![Feedback Form](https://drive.google.com/uc?export=view&id=1Y9Lw43iRzMMSivIZHxR-4EIR72htFGhj)

### 📊 Dashboard
![Dashboard](https://drive.google.com/uc?export=view&id=117f2xUUGAsN0VzzjtXyiEx30YSZe5MQu)

---

## 🔮 Roadmap

### 🎯 Phase 1 (Current) - Core Platform
- [x] User authentication and profiles
- [x] Feedback collection and display
- [x] AI-powered suggestions
- [x] Basic export functionality
- [x] Responsive web design

### 🚀 Phase 2 (Q2 2025) - Enhanced Features
- [ ] Advanced analytics dashboard
- [ ] Feedback categorization and tagging
- [ ] Custom branding options
- [ ] Team collaboration features
- [ ] API for third-party integrations

### 🌟 Phase 3 (Q3 2025) - Scale & Mobile
- [ ] Mobile application (React Native)
- [ ] Enterprise features and pricing
- [ ] Advanced AI insights and sentiment analysis
- [ ] White-label solutions
- [ ] International localization

### 🔄 Continuous Improvements
- [ ] Performance optimizations
- [ ] Security enhancements
- [ ] User experience improvements
- [ ] Feature requests from community

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🐛 Bug Reports
Found a bug? Please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### 💡 Feature Requests
Have an idea? Open an issue with:
- Detailed feature description
- Use case and benefits
- Mockups or examples (if available)

### 🔧 Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### 📝 Code Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add documentation for new features
- Ensure responsive design compatibility

---

## 🏆 Acknowledgments

- **Cohere AI** - For powering our intelligent feedback suggestions
- **Vercel** - For seamless deployment and hosting
- **Radix UI** - For beautiful, accessible UI components
- **Next.js Team** - For the amazing React framework
- **Open Source Community** - For inspiration and support

---

## 👨‍💻 Author

<div align="center">

**Sagar Singh**

*BTech CSE Student | Full-Stack Developer | AI Enthusiast*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/0sagarsingh01)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Unknownmaster0)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:sagar.singh.try01@gmail.com)

*"Building solutions that bridge the gap between feedback and growth"*

</div>

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Sagar Singh
```

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

**🔗 [Live Demo](https://feedback-app-pi-two.vercel.app/) | [Documentation](https://github.com/Unknownmaster0/feedback-app/blob/main/README.md) | [Report Bug](https://github.com/Unknownmaster0/feedback-app/issues)**

*Made with ❤️ by [Sagar Singh](https://github.com/Unknownmaster0)*

</div>
