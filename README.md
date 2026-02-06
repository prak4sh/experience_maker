# Experience Maker

A modern, minimalistic web application for creating and verifying professional experience letters. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Simple & Clean UI** - Minimalistic design focused on user experience
- 📝 **Easy Creation** - Intuitive form to create professional experience letters
- 🔗 **Share & Verify** - Send verification links to managers/clients
- ✅ **Digital Verification** - Managers can verify and sign letters digitally
- 📄 **PDF Download** - Generate and download professional PDF certificates
- 📱 **Responsive Design** - Works seamlessly on all devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd experience-maker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Experience Creators

1. **Create Experience Letter**
   - Navigate to `/create`
   - Fill in your personal information
   - Add project details (title, description, client company, dates)
   - List technologies used and key skills
   - Submit the form

2. **Share for Verification**
   - Copy the generated verification link
   - Send it to your manager or client
   - They can review and verify the experience

3. **Download PDF**
   - Once verified, download the professional PDF certificate
   - Use it for job applications, portfolio, or records

### For Managers/Clients

1. **Verify Experience**
   - Open the verification link received
   - Review the project details
   - Fill in your information (name, title, email)
   - Submit verification

2. **Digital Signature**
   - Your information serves as a digital signature
   - The verification timestamp is recorded
   - The letter becomes officially verified

## Technical Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **PDF Generation**: jsPDF, html2canvas
- **Date Handling**: date-fns
- **Storage**: LocalStorage (for demo) - easily replaceable with database
- **Deployment Ready**: Vercel, Netlify, or any hosting platform

## Project Structure

```
src/
├── app/
│   ├── create/           # Experience creation form
│   ├── verify/[id]/      # Verification page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── types/
│   └── experience.ts     # TypeScript interfaces
└── utils/
    └── pdfGenerator.ts   # PDF generation utilities
```

## Features in Detail

### Experience Letter Creation
- Comprehensive form with validation
- Support for multiple technologies and skills
- Date range selection for project duration
- Real-time form handling

### Verification System
- Unique verification links
- Manager information collection
- Verification status tracking
- Digital timestamp recording

### PDF Generation
- Professional letter formatting
- Company branding support
- Verification status indication
- Automated file naming

## Customization

### Styling
- Modify `tailwind.config.js` for custom colors/themes
- Update `globals.css` for component styles
- All components use Tailwind utility classes

### PDF Template
- Edit `src/utils/pdfGenerator.ts` to customize PDF layout
- Change colors, fonts, and formatting
- Add company logos or additional fields

### Data Storage
- Currently uses LocalStorage for demo purposes
- Replace with your preferred database (MongoDB, PostgreSQL, etc.)
- Update data operations in component files

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding Features

1. **Database Integration**
   - Replace LocalStorage with API calls
   - Add authentication and user management
   - Implement email notifications

2. **Enhanced Verification**
   - Add email verification for managers
   - Implement OTP verification
   - Add digital signature capture

3. **Additional Features**
   - Multiple letter templates
   - Company branding customization
   - Analytics and reporting
   - Bulk operations

## Security Considerations

- Implement proper authentication
- Add rate limiting for form submissions
- Validate all inputs server-side
- Use HTTPS in production
- Implement CSRF protection

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
- Build: `npm run build`
- Deploy the generated `.next` folder
- Ensure Node.js 18+ runtime

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

Built with ❤️ using Next.js and modern web technologies.# experience_maker
