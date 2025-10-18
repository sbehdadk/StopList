.PHONY: help install clean start build download status logs commit push setup check

# Variables
APP_NAME = StopList
VERSION := $(shell jq -r '.expo.version' app.json 2>/dev/null || echo "1.0.0")
BUILD_ID := $(shell eas build:list --limit 1 --json 2>/dev/null | jq -r '.[0].id // ""' 2>/dev/null || echo "")
APK_NAME = stoplist-v$(VERSION).apk

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

clean: ## Clean build artifacts and caches
	@echo "🧹 Cleaning..."
	rm -rf node_modules
	rm -rf .expo
	rm -rf android/app/build
	rm -rf android/build
	rm -f *.apk
	@echo "✓ Clean complete!"

start: ## Start development server
	@echo "🚀 Starting Expo development server..."
	npm start

android: ## Run on Android device/emulator
	@echo "📱 Running on Android..."
	npm run android

build: check ## Build APK on EAS (checks dependencies first)
	@echo "🏗️  Starting EAS build..."
	@echo "⚠️  This will use your EAS build credits"
	@eas build --platform android --profile preview --non-interactive
	@echo ""
	@echo "📊 Checking build status..."
	@make status

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

download: ## Download latest successful APK
	@echo "📥 Downloading APK..."
	@BUILD_ID=$$(eas build:list --limit 1 --json 2>/dev/null | jq -r '.[0] | select(.status=="finished") | .id // ""'); \
	if [ -z "$$BUILD_ID" ]; then \
		echo "❌ No successful build found"; \
		exit 1; \
	fi; \
	APK_URL=$$(eas build:list --limit 1 --json 2>/dev/null | jq -r '.[0] | select(.status=="finished") | .artifacts.applicationArchiveUrl // ""'); \
	if [ -n "$$APK_URL" ]; then \
		echo "Downloading from: $$APK_URL"; \
		curl -L -o $(APK_NAME) "$$APK_URL"; \
		echo ""; \
		echo "✓ Downloaded: $(APK_NAME)"; \
		ls -lh $(APK_NAME); \
	else \
		echo "❌ No APK URL found"; \
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
