module.exports = {
  expo: {
    name: "SATez",
    slug: "SATez",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "satez",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    jsEngine: "hermes",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.satez.app",
      associatedDomains: [
        "applinks:satez.app"
      ],
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              "satez",
              "com.satez.app"
            ]
          }
        ]
      }
    },
    android: {
      package: "com.satez.app",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "satez",
              host: "auth"
            }
          ],
          category: ["BROWSABLE", "DEFAULT"]
        }
      ],
      edgeToEdgeEnabled: true,
      softwareKeyboardLayoutMode: "pan"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      "react-native-reanimated"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      // You can replace these with your actual values for the build
      supabaseUrl: "https://your-project-id.supabase.co",
      supabaseAnonKey: "your-anon-key",
      groqApiKey: "your-groq-api-key",
      eas: {
        projectId: "6230283f-635a-49ca-b82e-1cc6a573b15c"
      }
    }
  }
}; 