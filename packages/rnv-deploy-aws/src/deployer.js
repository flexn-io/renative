/* eslint-disable import/no-dynamic-require, global-require */
import aws from 'aws-sdk';
import { getInstalledPath } from 'get-installed-path';
import path from 'path';
import fs from 'fs';
import uuid from 'uuid/v1';
import mime from 'mime-types';

class Deployer {
    async initialize(configRegion) {
        const rnvPath = await getInstalledPath('rnv', { local: false });
        const { inquirerPrompt } = require(path.join(rnvPath, 'dist/systemTools/prompt'));
        const { logDebug } = require(path.join(rnvPath, 'dist/systemTools/logger'));
        this.logDebug = logDebug;
        let region = configRegion;

        // check if we have credentials for AWS
        try {
            await new Promise((resolve, reject) => aws.config.getCredentials((err) => {
                if (err) return reject(err);
                return resolve();
            }));
        } catch (e) {
        // get all the regions from ec2
            const ec2 = new aws.EC2();
            const regions = await ec2.describeRegions().promise();
            const { accessKeyId } = await inquirerPrompt({
                type: 'input',
                name: 'accessKeyId',
                message: 'Your AWS ACCESS_KEY_ID'
            });
            const { secretAccessKey } = await inquirerPrompt({
                type: 'input',
                name: 'secretAccessKey',
                message: 'Your AWS SECRET_ACCESS_KEY'
            });
            if (!region) {
                const regionAnswer = await inquirerPrompt({
                    type: 'select',
                    name: 'region',
                    choices: regions.data.Regions.map(r => r.RegionName),
                    message: 'AWS Region'
                });
                // eslint-disable-next-line prefer-destructuring
                region = regionAnswer.region;
            }
            const options = {
                secretAccessKey,
                region,
                accessKeyId
            };

            this.s3 = new aws.S3(options);
            this.r53 = new aws.Route53(options);
            this.cf = new aws.CloudFront(options);

            return;
        }

        this.s3 = new aws.S3();
        this.r53 = new aws.Route53();
        this.cf = new aws.CloudFront();
    }

    async deployVersion(bucket, version, url, deployPath) {
        // ensure route53 exists
        await this.ensureHostedZoneExists(bucket);

        await this.emptyS3Directory(bucket, version);

        await this.uploadFolderToS3(deployPath, version, bucket);

        await this.s3.deleteObject({
            Bucket: bucket,
            Key: 'index.html'
        }).promise();

        await this.s3.putObject({
            Bucket: bucket,
            Key: 'index.html',
            ContentType: 'text/html',
            Body: `<body><head><meta http-equiv="refresh" content="0; URL=${url} /></head></body>`
        }).promise();
    }

    async uploadFolderToS3(source, destination, bucket) {
        const files = fs.readdirSync(source);
        if (!files || files.length === 0) {
            throw new Error(`Provided folder '${source}' is empty or does not exist. Make sure your project was compiled!`);
        }

        // for each file in the directory
        await Promise.all(files.map((file) => {
        // get the full path of the file
            const filePath = path.join(source, file);

            // directory
            if (fs.lstatSync(filePath).isDirectory()) {
                return this.uploadFolderToS3(`${source}/${file}`, `${destination}/${file}`, bucket);
            }

            // read file contents
            const fileContent = fs.readFileSync(filePath);

            // upload file to S3
            this.logDebug('uploading', filePath, 'to', `${destination}/${file}`);
            return this.s3.putObject({
                Bucket: bucket,
                Key: `${destination}/${file}`,
                Body: fileContent,
                ContentType: mime.lookup(file),
            }).promise();
        }));
    }

    async emptyS3Directory(bucket, dir) {
        const listParams = {
            Bucket: bucket,
            Prefix: dir
        };

        const listedObjects = await this.s3.listObjectsV2(listParams).promise();

        if (listedObjects.Contents.length === 0) return;

        const deleteParams = {
            Bucket: bucket,
            Delete: { Objects: [] }
        };

        listedObjects.Contents.forEach(({ Key }) => {
            deleteParams.Delete.Objects.push({ Key });
        });

        await this.s3.deleteObjects(deleteParams).promise();

        if (listedObjects.IsTruncated) await this.emptyS3Directory(bucket, dir);
    }

    async ensureHostedZoneExists(bucket) {
        const domain = bucket.split('.').slice(1).join('.');
        const app = bucket.split('.')[0];

        this.logDebug(`checking if ${domain} exists and has a CNAME of ${app}`);
        const zone = await this.getHostedZone(domain);
        if (!zone) {
            this.logDebug(`${domain} hosted zone does not exists. Creating...`);
            // const newZone = await this.r53.createHostedZone({ Name: domain, CallerReference: uuid() }).promise();
            // zone = newZone.data.HostedZone;
            if (!zone) throw new Error('Zone was not correctly created!');
        }
        this.logDebug(`checking if ${domain} has the ${app} CNAME`);
        console.log(zone);
    }

    async getHostedZone(domain) {
        let foundZone = false;

        // recursive with pagination
        const getZone = async (Marker) => {
            const result = await this.r53.listHostedZones({ Marker }).promise();
            result.HostedZones.forEach((zone) => {
                if (zone.Name.slice(0, -1) === domain) { // remove last char, since zones are specified with a dot at the end
                    foundZone = zone;
                }
            });
            if (foundZone) return;
            if (result.IsTruncated) await getZone(result.NextMarker);
        };

        await getZone();
        return foundZone;
    }
}

export default new Deployer();
