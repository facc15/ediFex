import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.edifex.www',
  appName: 'edifex',
  webDir: 'www',
  plugins: {
    SplashScreen:{
      launchShowDuration:4000,
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
