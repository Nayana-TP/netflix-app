# Netflix Clone

A Netflix-inspired frontend application built with React, TypeScript, and Tailwind CSS. This application fetches movie data from The Movie Database (TMDB) API and displays it in a Netflix-style interface.

## Features

- **Auto-rotating Featured Carousel**: Displays trending movies with automatic rotation every 5 seconds
- **Movie Categories**: Multiple rows showcasing different movie categories (Trending, Popular, Top Rated, Now Playing)
- **Responsive Design**: Mobile-friendly layout that works across all devices
- **Netflix-style UI**: Dark theme with red accent colors matching Netflix's design
- **API Integration**: Real-time data fetching from TMDB API
- **Error Handling**: Graceful error handling and loading states
- **Test Coverage**: Comprehensive test suite for API services and custom hooks

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Vite** - Build tool
- **Vitest** - Testing framework
- **TMDB API** - Movie data source

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd netflix-clone
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### API Configuration

The application uses the TMDB API with the provided API key. The API key is already configured in the `src/services/api.ts` file.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Testing

The application includes comprehensive tests for:

- API service functions
- Custom React hooks
- Image URL generation
- Error handling

Run tests with:
```bash
npm run test
```

## Project Structure

```
src/
├── components/           # React components
│   ├── FeaturedCarousel.tsx
│   ├── MovieCard.tsx
│   └── MovieRow.tsx
├── hooks/               # Custom React hooks
│   ├── useMovies.ts
│   └── __tests__/
├── services/            # API services
│   ├── api.ts
│   └── __tests__/
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## Features in Detail

### Featured Carousel
- Auto-rotates through trending movies every 5 seconds
- Manual navigation with arrow buttons and dot indicators
- Displays movie backdrop, title, overview, and rating
- Play and More Info buttons for each featured movie

### Movie Rows
- Horizontal scrolling rows for different movie categories
- Hover effects showing play and info buttons
- Movie posters with title, rating, and release year
- Responsive grid layout

### API Integration
- Fetches trending, popular, top-rated, and now playing movies
- Real-time data updates
- Error handling for API failures
- Optimized image loading with TMDB image URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is for educational purposes only. All movie data and images are provided by TMDB API.

## Acknowledgments

- TMDB API for providing movie data
- Netflix for design inspiration
- React and TypeScript communities
