module.exports = ({ env }) => ({
    // ...
    email: {
      provider: 'amazon-ses',
      providerOptions: {
        key: env('AWS_ACCESS_KEY_ID'),
        secret: env('AWS_ACCESS_SECRET'),
        amazon: 'https://email.sa-east-1.amazonaws.com',
      },
      settings: {
        defaultFrom: 'hugoszervinsk@gmail.com',
        defaultReplyTo: 'hugoszervinsk@gmail.com',
      },
    },
    // ...
  });