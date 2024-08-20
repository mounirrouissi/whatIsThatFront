import * as Linking from 'expo-linking';
const LinkingConfiguration = {
  prefixes: [Linking.createURL('/')], // Your app's base URL
  config: {
    screens: {
      '(auth)': {
        screens: {
          'auth': 'login', // Example: /login opens the auth screen
        },
      },
      '(app)': {
        screens: {
          'home': 'home',  // Example: /home opens the home screen
          'profile': 'profile', // Example: /profile opens the profile screen
        },
      },
      NotFound: '*', // Handle cases where no matching route is found
    },
  },
};

export default LinkingConfiguration;
