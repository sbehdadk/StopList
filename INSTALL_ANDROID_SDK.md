# Install Android SDK on Raspberry Pi

## Quick Install (Command Line Tools only)

```bash
# Install Java
sudo apt update
sudo apt install openjdk-17-jdk -y

# Download Android Command Line Tools
mkdir -p ~/Android/cmdline-tools
cd ~/Android/cmdline-tools
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-11076708_latest.zip
mv cmdline-tools latest

# Set environment variables
echo 'export ANDROID_HOME=$HOME/Android' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
source ~/.zshrc

# Accept licenses and install required packages
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Create local.properties
cd /home/pi/projects/stoplist/android
echo "sdk.dir=$HOME/Android" > local.properties

# Now try building again
cd /home/pi/projects/stoplist/android
./gradlew assembleRelease
```

## APK Location After Build
`/home/pi/projects/stoplist/android/app/build/outputs/apk/release/app-release.apk`

