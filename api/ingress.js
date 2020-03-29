import AWS from 'aws-sdk';

export const handler = async (event) => {
    const mediaconvert = new AWS.MediaConvert();

    console.log('env', process.env);
    console.log('event', JSON.stringify(event, null, 3));
    const FileInput = `s3://${event.Records[0].s3.bucket.name}/${event.Records[0].s3.object.key}`;
    const { Endpoints } = await mediaconvert.describeEndpoints().promise();
    console.log('endpoints', Endpoints);
    const client = new AWS.MediaConvert({ endpoint: Endpoints[0].Url });

    const params = {
        Role: process.env.MEDIA_CONVERT_ROLE, /* required */
        AccelerationSettings: {
            Mode: 'DISABLED',
        },
        JobTemplate: process.env.MEDIA_CONVERT_TEMPLATE,
        Settings: {
            Inputs: [
                {
                    FileInput
                }
            ],
            OutputGroups: [
                {
                    OutputGroupSettings: {
                        HlsGroupSettings: {
                            Destination: `s3://712353861994-dev-video-output/${event.Records[0].s3.object.key}/`,
                            DestinationSettings: {
                                S3Settings: {
                                    AccessControl: {
                                        CannedAcl: 'PUBLIC_READ'
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    OutputGroupSettings: {
                        HlsGroupSettings: {
                            Destination: `s3://712353861994-dev-video-output/${event.Records[0].s3.object.key}/`,
                            DestinationSettings: {
                                S3Settings: {
                                    AccessControl: {
                                        CannedAcl: 'PUBLIC_READ'
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
    };
    return client.createJob(params).promise();
};
