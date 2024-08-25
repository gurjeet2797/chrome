// replace the user pool region, id, and app client id details
export default
{
 Auth: {
  Cognito: {
   userPoolId: "us-east-1_NUxtaCv98",
   userPoolWebClientId: "40svo6phr3omfqdp0f23d2j3c5",
   userPoolClientId: "2vqi16smpcrrjg1rvnp77ch9v1",
   identityPoolId: "us-east-1:7fd33cf0-d497-40ca-abe4-93c369219b60",
   region: "us-east-1",
   loginWith: {
    oauth: {
     domain: 'https://calie.auth.us-east-1.amazoncognito.com',
     scopes: ['openid email phone profile aws.cognito.signin.user.admin'],
     redirectSignIn: [window.location.origin],
     redirectSignOut: [window.location.origin],
     responseType: 'code',
    },
    username: true,
   }
  }
 },
 API: {
   GraphQL: {
    endpoint:
     'https://xg5eea5g2rdgpodtty3lr7y7r4.appsync-api.us-east-1.amazonaws.com/graphql',
    defaultAuthMode: 'apiKey',
    apiKey: 'da2-ifnf6zv4ozhrnnhazmske5wck4', // Optional
    region: 'us-east-1', // Optional
   }
  }
}