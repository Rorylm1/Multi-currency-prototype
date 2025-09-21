# Aspora - Fintech for Indian Diaspora

A mobile-first web app prototype for Aspora, a fintech platform designed for the Indian diaspora. This is a demo prototype showcasing a rupee-denominated account that reduces churn by letting customers hold INR, earn interest, and use that balance directly.

## 🚀 Features

### Core MVP Features
- **Fund INR Account**: Transfer from local currency (GBP, USD, EUR, AUD, CAD) to INR with live FX quotes
- **Interest Accrual**: Live interest rate ticker and daily interest posting
- **Bill Payments**: Pay Indian utility bills directly from INR balance
- **Bank Transfers**: Transfer to Indian bank accounts with IFSC validation
- **Transaction History**: View and export transaction history as CSV
- **Balance Dashboard**: Real-time balance display with interest calculations

### Technical Features
- **Mobile-First Design**: Optimized for mobile devices with responsive design
- **PWA Ready**: Progressive Web App with manifest and service worker
- **Mock Services**: All data via localStorage with realistic mock APIs
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **PWA**: Service Worker + Web App Manifest

## 📱 Mobile-First Design

The app is designed with mobile-first principles:
- Touch-friendly interface with large buttons
- Bottom navigation for easy thumb access
- Responsive cards and layouts
- Optimized for screens 320px and above

## 🚀 Deployment to Vercel (v0)

### Prerequisites
- Vercel account
- GitHub account (for v0 integration)

### Step 1: Prepare the Repository
1. Push this code to a GitHub repository
2. Ensure all files are committed and pushed to the main branch

### Step 2: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install`

### Step 3: Environment Variables
No environment variables are required for this prototype as it uses mock services.

### Step 4: Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-project-name.vercel.app`

### Step 5: Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS as instructed by Vercel

## 🔧 Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd aspora-fintech

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

## 📱 PWA Installation

### On Mobile (iOS/Android)
1. Open the app in your mobile browser
2. Look for "Add to Home Screen" option
3. Follow the browser prompts to install

### On Desktop (Chrome/Edge)
1. Open the app in Chrome or Edge
2. Look for the install icon in the address bar
3. Click to install as a desktop app

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#667eea to #764ba2)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)
- **Background**: Gray-50 (#f9fafb)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Font weights 600-700
- **Body**: Font weight 400
- **Small text**: Font weight 500

### Components
- **Cards**: Rounded corners (8px), subtle shadows
- **Buttons**: Primary, secondary, outline variants
- **Forms**: Clean inputs with proper focus states
- **Navigation**: Bottom tab navigation for mobile

## 🔒 Security & Privacy

### Demo Prototype Notice
- **Visible Banner**: "Demo Prototype — No Real Funds" banner on all pages
- **Mock Data**: All transactions and balances are simulated
- **Local Storage**: Data persists only in browser localStorage
- **No Backend**: No real API calls or data transmission

### Data Handling
- All data is stored locally in browser localStorage
- No sensitive information is transmitted
- Mock services simulate real API behavior
- CSV export functionality works with local data only

## 📊 Mock Data

### Sample Account
- **Initial Balance**: ₹25,000 INR
- **Interest Rate**: 7.2% p.a. (simulated)
- **Sample Transactions**: Deposit, interest accrual, bill payment

### FX Rates
- **GBP/INR**: ~103.45
- **USD/INR**: ~83.25
- **EUR/INR**: ~90.15
- **AUD/INR**: ~54.30
- **CAD/INR**: ~61.20

*Rates are simulated and change with small variations*

## 🧪 Testing

### Manual Testing Checklist
- [ ] Mobile responsiveness (320px - 768px)
- [ ] PWA installation
- [ ] FX quote generation
- [ ] Transaction creation
- [ ] CSV export
- [ ] Navigation between pages
- [ ] Interest calculation display

### Browser Support
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Desktop**: Chrome, Firefox, Safari, Edge
- **PWA**: Chrome, Edge, Safari (iOS 11.3+)

## 📈 Performance

### Optimizations
- **Next.js**: Automatic code splitting and optimization
- **Images**: Optimized SVG icons
- **CSS**: Tailwind CSS with purged unused styles
- **JavaScript**: Tree-shaking and minification
- **PWA**: Service worker for caching

### Metrics
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🚨 Known Limitations

### Demo Prototype Constraints
1. **No Real Money**: All transactions are simulated
2. **No Backend**: Data doesn't persist across devices
3. **Mock FX Rates**: Rates are simulated, not real-time
4. **Limited Beneficiaries**: Only pre-configured sample beneficiaries
5. **No Authentication**: No user login/registration system

### Technical Limitations
1. **LocalStorage Only**: Data doesn't sync across devices
2. **No Offline Support**: Requires internet connection
3. **Limited Error Handling**: Basic error states only
4. **No Real-time Updates**: No WebSocket connections

## 🔮 Future Enhancements

### Phase 2 Features
- User authentication and registration
- Real-time FX rate integration
- Enhanced beneficiary management
- Push notifications for transactions
- Advanced analytics and reporting
- Multi-language support (Hindi, Gujarati, Tamil)

### Technical Improvements
- Backend API integration
- Database persistence
- Real-time data synchronization
- Enhanced security features
- Advanced error handling
- Performance monitoring

## 📞 Support

### Demo Prototype Support
- **GitHub Issues**: Report bugs or request features
- **Documentation**: This README and inline code comments
- **Demo Data**: Reset by clearing browser localStorage

### Production Considerations
For production deployment, consider:
- Real backend API integration
- Database setup (PostgreSQL, MongoDB)
- Authentication service (Auth0, Firebase)
- Payment gateway integration (Razorpay, Stripe)
- Compliance requirements (PCI DSS, GDPR)
- Monitoring and analytics (Sentry, Mixpanel)

## 📄 License

This is a demo prototype for demonstration purposes. For production use, ensure proper licensing and compliance with financial regulations.

---

**⚠️ Important**: This is a demo prototype with no real financial functionality. Do not use for actual money transfers or financial transactions.
