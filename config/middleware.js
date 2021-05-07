module.exports = ({ env }) => ({
    settings: {
        cors: {
          enabled: true,
          credentials: true,
          origin: ['http://staging.rangosemfila.com.br', 'https://staging.rangosemfila.com.br', 'http://www.staging.rangosemfila.com.br', 'https://www.staging.rangosemfila.com.br', 'http://localhost:8080', 'http://172.20.10.7:8080', 'http://localhost:8080/', 'http://172.20.10.7:8080/'] // Change to My Dashboard domain later
        },
    },
});