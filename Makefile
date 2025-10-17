# StopList - Development & Deployment Commands

.PHONY: help install start android ios test build-dev build-preview build-prod submit-android update clean version-patch version-minor version-major

# Default target
help:
	@echo "StopList - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make install       - Install all dependencies"
	@echo "  make start         - Start Expo dev server"
	@echo "  make android       - Run on Android device"
	@echo "  make ios           - Run on iOS device"
	@echo "  make test          - Run tests"
	@echo ""
	@echo "Versioning:"
	@echo "  make version-patch - Bump patch version (1.0.0 → 1.0.1)"
	@echo "  make version-minor - Bump minor version (1.0.0 → 1.1.0)"
	@echo "  make version-major - Bump major version (1.0.0 → 2.0.0)"
	@echo ""
	@echo "Building:"
	@echo "  make build-dev     - Build development APK (for testing with ads)"
	@echo "  make build-preview - Build preview APK (test before production)"
	@echo "  make build-prod    - Build production AAB (for Google Play)"
	@echo ""
	@echo "Deployment:"
	@echo "  make submit        - Submit to Google Play Store"
	@echo "  make update        - Push OTA update to users"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean         - Clean build cache"
	@echo "  make status        - Show project status"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install

# Start development server
start:
	@echo "🚀 Starting Expo dev server..."
	@echo "Scan QR code with Expo Go app on your phone"
	npx expo start

# Run on Android
android:
	@echo "🤖 Running on Android..."
	npx expo start --android

# Run on iOS
ios:
	@echo "🍎 Running on iOS..."
	npx expo start --ios

# Run tests
test:
	@echo "🧪 Running tests..."
	npm test

# Version bumping
version-patch:
	@echo "📦 Bumping patch version..."
	@node scripts/bump-version.js patch

version-minor:
	@echo "📦 Bumping minor version..."
	@node scripts/bump-version.js minor

version-major:
	@echo "📦 Bumping major version..."
	@node scripts/bump-version.js major

# Build development version (for testing)
build-dev:
	@echo "🔨 Building development APK..."
	@echo "This includes debugging and you can test AdMob ads"
	@echo "Build will take ~15-20 minutes"
	eas build --platform android --profile development
	@echo "✅ Build started! Check: https://expo.dev/accounts/sinabehdadk/projects/stoplist/builds"

# Build preview version (test before production)
build-preview:
	@echo "🔨 Building preview APK..."
	@echo "This is like production but as APK (easier to test)"
	@echo "Build will take ~15-20 minutes"
	eas build --platform android --profile preview
	@echo "✅ Build started! Check: https://expo.dev/accounts/sinabehdadk/projects/stoplist/builds"

# Build production version (for Google Play)
build-prod:
	@echo "🔨 Building production AAB for Google Play..."
	@echo "This is the final version for store submission"
	@echo "Build will take ~15-20 minutes"
	eas build --platform android --profile production
	@echo "✅ Build started! Check: https://expo.dev/accounts/sinabehdadk/projects/stoplist/builds"

# Submit to Google Play
submit:
	@echo "📤 Submitting to Google Play Store..."
	@echo "Make sure you have a production build first!"
	eas submit --platform android
	@echo "✅ Submitted! Check Google Play Console for review status"

# Push OTA update
update:
	@echo "🔄 Publishing OTA update..."
	@read -p "Enter update message: " msg; \
	eas update --branch production --message "$$msg"
	@echo "✅ Update published! Users will get it on next app restart"

# Clean build cache
clean:
	@echo "🧹 Cleaning build cache..."
	rm -rf node_modules
	rm -rf .expo
	rm -rf android/build
	rm -rf ios/build
	npm install
	@echo "✅ Clean complete!"

# Show project status
status:
	@echo "📊 Project Status:"
	@echo ""
	@echo "Expo Account: sinabehdadk"
	@echo "Project: StopList"
	@echo ""
	@npx expo whoami || echo "❌ Not logged in to Expo"
	@echo ""
	@echo "Recent builds:"
	@eas build:list --limit 3 || echo "Run 'eas login' first"

# Quick test on phone
test-phone:
	@echo "📱 Testing on your phone:"
	@echo "1. Install 'Expo Go' app from Play Store"
	@echo "2. Run: make start"
	@echo "3. Scan QR code with Expo Go app"
	@echo ""
	@echo "Note: AdMob ads won't show in Expo Go"
	@echo "For testing ads, use: make build-dev"

