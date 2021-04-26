module.exports = ({ env }) => ({
    settings: {
        cors: {
          enabled: true,
          credentials: true,
          origin: ['http://staging.rangosemfila.com.br', 'https://staging.rangosemfila.com.br', 'http://www.staging.rangosemfila.com.br', 'https://www.staging.rangosemfila.com.br'] // Change to My Dashboard domain later
        },
    },
});