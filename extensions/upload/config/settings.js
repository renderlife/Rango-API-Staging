module.exports = {
    provider: 'aws-s3',
    providerOptions: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_ACCESS_SECRET,
      region: "sa-east-1",
      params: {
        Bucket: "restaurants.images.release"
      }
    },
  };