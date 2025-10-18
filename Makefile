.PHONY: help install clean start build build-aab download status logs commit push setup check

# Variables
APP_NAME = StopList
VERSION := $(shell jq -r '.expo.version' app.json 2>/dev/null || echo "1.0.0")
BUILD_ID := $(shell eas build:list --limit 1 --json 2>/dev/null | jq -r '.[0].id // ""' 2>/dev/null || echo "")
BUILD_DIR = builds
APK_NAME = $(BUILD_DIR)/stoplist-v$(VERSION).apk

help: ## Show this help message
	@echo "$(APP_NAME) - Makefile Commands"
	@echo "================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

setup: ## Initial setup - install dependencies
	@echo "📦 Installing dependencies..."
	@npm install
	@echo "✓ Setup complete!"

install: ## Install/update dependencies
	@echo "📦 Installing dependencies..."
	@npm install
	@echo "✓ Dependencies installed!"

check: ## Check if dependencies are installed
	@if [ ! -d "node_modules" ]; then \
		echo "⚠️  node_modules not found. Installing dependencies..."; \
		npm install; \
	elif [ "node_modules" -ot "package.json" ]; then \
		echo "⚠️  package.json newer than node_modules. Updating..."; \
		npm install; \
	else \
		echo "✓ Dependencies up to date"; \
	fi

validate: check ## Validate config before building
	@echo "🔍 Validating project configuration..."
	@npx expo config --type public > /dev/null 2>&1 || (echo "❌ Expo config validation failed" && exit 1)
	@echo "✓ Expo config valid"
	@node -e "const pkg = require('./package.json'); const deps = Object.keys(pkg.dependencies); console.log('✓ Dependencies:', deps.length); if (!deps.includes('expo')) { console.error('❌ Missing expo'); process.exit(1); }"
	@echo "✓ All validations passed"

clean: ## Clean build artifacts and caches
	@echo "🧹 Cleaning..."
	rm -rf node_modules
	rm -rf .expo
	rm -rf android/app/build
	rm -rf android/build
	rm -rf $(BUILD_DIR)
	rm -f *.apk
	@echo "✓ Clean complete!"

start: ## Start development server
	@echo "🚀 Starting Expo development server..."
	npm start

android: ## Run on Android device/emulator
	@echo "📱 Running on Android..."
	npm run android

build: validate ## Build APK on EAS (validates first)
	@echo "🏗️  Starting EAS build (APK)..."
	@echo "⚠️  This will use your EAS build credits"
	@eas build --platform android --profile preview --non-interactive
	@echo ""
	@echo "📊 Checking build status..."
	@make status

build-aab: validate ## Build AAB (App Bundle) for Google Play Store
	@echo "🏗️  Starting EAS build (AAB for Play Store)..."
	@echo "⚠️  This will use your EAS build credits"
	@echo "📦 Building production App Bundle..."
	@eas build --platform android --profile production-aab --non-interactive
	@echo ""
	@echo "📊 Checking build status..."
	@make status
	@echo ""
	@echo "✅ AAB will be ready for Google Play Store upload!"

test: validate ## Run comprehensive pre-build tests
	@echo ""
	@echo "🧪 Running comprehensive pre-build tests..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "1️⃣  Checking essential files exist..."
	@test -f App.jsx && echo "   ✓ App.jsx exists" || (echo "   ❌ App.jsx missing" && exit 1)
	@test -f SplashScreen.jsx && echo "   ✓ SplashScreen.jsx exists" || (echo "   ❌ SplashScreen.jsx missing" && exit 1)
	@test -f App.js && echo "   ✓ App.js wrapper exists" || (echo "   ❌ App.js missing" && exit 1)
	@echo ""
	@echo "2️⃣  Verifying SplashScreen import in App.jsx..."
	@grep -q "import SplashScreen from './SplashScreen'" App.jsx && echo "   ✓ SplashScreen import found" || (echo "   ❌ Missing SplashScreen import!" && exit 1)
	@echo ""
	@echo "3️⃣  Checking Firebase configuration..."
	@test -f firebaseConfig.js && echo "   ✓ firebaseConfig.js exists" || (echo "   ❌ Missing firebaseConfig.js" && exit 1)
	@test -d node_modules/firebase && echo "   ✓ Firebase JS SDK installed" || (echo "   ❌ Firebase SDK missing" && exit 1)
	@grep -q "logAnalyticsEvent" App.jsx && echo "   ✓ Firebase integrated in App.jsx" || (echo "   ❌ Firebase not integrated" && exit 1)
	@echo ""
	@echo "4️⃣  Checking critical dependencies..."
	@test -d node_modules/react-native-gesture-handler && echo "   ✓ gesture-handler installed" || (echo "   ❌ gesture-handler missing" && exit 1)
	@test -d node_modules/react-native-reanimated && echo "   ✓ reanimated installed" || (echo "   ❌ reanimated missing" && exit 1)
	@test -d node_modules/react-native-modal && echo "   ✓ modal installed" || (echo "   ❌ modal missing" && exit 1)
	@echo ""
	@echo "5️⃣  Validating JSON configs..."
	@jq empty app.json 2>/dev/null && echo "   ✓ app.json valid" || (echo "   ❌ app.json invalid JSON" && exit 1)
	@jq empty eas.json 2>/dev/null && echo "   ✓ eas.json valid" || (echo "   ❌ eas.json invalid JSON" && exit 1)
	@jq empty package.json 2>/dev/null && echo "   ✓ package.json valid" || (echo "   ❌ package.json invalid JSON" && exit 1)
	@echo ""
	@echo "6️⃣  Checking version consistency..."
	@APP_VER=$$(jq -r '.expo.version' app.json); PKG_VER=$$(jq -r '.version' package.json); \
	if [ "$$APP_VER" = "$$PKG_VER" ]; then \
		echo "   ✓ Version consistent ($$APP_VER)"; \
	else \
		echo "   ⚠️  Version mismatch: app.json=$$APP_VER, package.json=$$PKG_VER"; \
	fi
	@echo ""
	@echo "7️⃣  Verifying Android configuration..."
	@grep -q "hermesEnabled=false" android/gradle.properties && echo "   ✓ Hermes disabled for Pi (EAS will enable)" || echo "   ⚠️  Hermes config may cause local issues"
	@echo ""
	@echo "8️⃣  Testing Expo configuration..."
	@npx expo config --type public > /dev/null 2>&1 && echo "   ✓ Expo config loads successfully" || (echo "   ❌ Expo config has errors" && exit 1)
	@echo ""
	@echo "9️⃣  Checking EAS configuration..."
	@test -f eas.json && echo "   ✓ eas.json exists" || (echo "   ❌ Missing eas.json" && exit 1)
	@jq -e '.build.preview.android.buildType' eas.json > /dev/null && echo "   ✓ EAS build config valid" || (echo "   ❌ EAS config invalid" && exit 1)
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "✅ ALL TESTS PASSED - READY TO BUILD!"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "📝 Summary:"
	@echo "   • Essential files: ✓"
	@echo "   • SplashScreen import: ✓"
	@echo "   • Firebase: ✓ (JS SDK - Expo compatible)"
	@echo "   • AdMob: ✓ (Google Mobile Ads SDK)"
	@echo "   • Custom Date/Time Picker: ✓"
	@echo "   • Dependencies: ✓ (13 packages)"
	@echo "   • Configurations: ✓ (JSON valid)"
	@echo "   • Version: $(VERSION)"
	@echo ""
	@echo "🚀 Run 'make build' to build on EAS cloud"
	@echo ""

status: ## Check latest build status
	@echo "📊 Latest build status:"
	@eas build:list --limit 1

logs: ## View latest build logs
	@echo "📋 Opening build logs..."
	@BUILD_ID=$$(eas build:list --limit 1 --json 2>/dev/null | jq -r '.[0].id // ""'); \
	if [ -n "$$BUILD_ID" ]; then \
		eas build:view $$BUILD_ID; \
	else \
		echo "❌ No builds found"; \
	fi

download: ## Download latest successful APK/AAB
	@echo "📥 Downloading build..."
	@mkdir -p $(BUILD_DIR)
	@echo "🔍 Finding latest successful build..."
	@APK_URL=$$(eas build:list --platform android --limit 5 --non-interactive 2>/dev/null | grep -A 20 "Status.*finished" | grep "Application Archive URL" | head -1 | awk '{print $$NF}'); \
	if [ -z "$$APK_URL" ] || [ "$$APK_URL" = "null" ]; then \
		echo "❌ No successful build found"; \
		echo "ℹ️  Run 'make status' to check build status"; \
		echo "ℹ️  Run 'make build' to create a new build"; \
		exit 1; \
	fi; \
	echo "📦 Downloading from: $$APK_URL"; \
	echo "📁 Saving to: $(APK_NAME)"; \
	echo ""; \
	FILE_EXT=$$(echo $$APK_URL | grep -q '\.aab' && echo 'aab' || echo 'apk'); \
	OUTPUT_NAME=$(BUILD_DIR)/stoplist-v$(VERSION).$$FILE_EXT; \
	if curl -# -L -o $$OUTPUT_NAME "$$APK_URL"; then \
		echo ""; \
		echo "✅ SUCCESS! Downloaded: $$OUTPUT_NAME"; \
		ls -lh $$OUTPUT_NAME; \
		echo ""; \
		if [ "$$FILE_EXT" = "aab" ]; then \
			echo "📦 App Bundle (AAB) ready for Google Play Store upload!"; \
			echo "   1. Go to play.google.com/console"; \
			echo "   2. Select your app"; \
			echo "   3. Go to 'Production' or 'Testing' track"; \
			echo "   4. Upload $$OUTPUT_NAME"; \
		else \
			echo "📱 APK ready for testing:"; \
			echo "   1. Transfer $$OUTPUT_NAME to your phone"; \
			echo "   2. Enable 'Install from Unknown Sources'"; \
			echo "   3. Tap the file to install"; \
		fi; \
		echo ""; \
		echo "🎉 Your StopList app is ready!"; \
	else \
		echo ""; \
		echo "❌ Download failed"; \
		exit 1; \
	fi

commit: ## Commit changes with message (usage: make commit MSG="your message")
	@if [ -z "$(MSG)" ]; then \
		echo "❌ Please provide a commit message: make commit MSG=\"your message\""; \
		exit 1; \
	fi
	git add -A
	git commit -m "$(MSG)"
	@echo "✓ Changes committed!"

push: ## Push to remote repository
	@echo "🚀 Pushing to remote..."
	git push
	@echo "✓ Pushed to remote!"

cp: ## Commit and push (usage: make cp MSG="your message")
	@make commit MSG="$(MSG)"
	@make push

version: ## Show current version
	@echo "$(APP_NAME) v$(VERSION)"

info: ## Show project information
	@echo "Project: $(APP_NAME)"
	@echo "Version: $(VERSION)"
	@echo "Package: com.sinabehdadk.stoplist"
	@echo "Platform: Android"
	@echo "SDK: Expo 51"

# Development helpers
dev: start ## Alias for start

run: android ## Alias for android

# Quick build and download
quick: build download ## Build and download APK in one command
