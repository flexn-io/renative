/* eslint-disable import/no-dynamic-require, global-require */
import { getInstalledPath } from 'get-installed-path';
import path from 'path';

import Deployer from './deployer';

const deployToAWS = async (version) => {
    const rnvPath = await getInstalledPath('rnv', { local: false });
    const config = require(path.join(rnvPath, 'dist/config')).default;

    const { getConfigProp, getAppTitle } = require(path.join(rnvPath, 'dist/common'));
    const { platform, paths, runtime, program: { scheme } } = config.getConfig();
    const schemes = getConfigProp(config.getConfig(), platform, 'buildSchemes');
    const selectedSchemeAwsSettings = schemes?.[scheme]?.awsDeploy;
    if (!selectedSchemeAwsSettings) throw new Error(`renative.json platforms.${platform}.buildSchemes.${scheme}.awsDeploy object is missing`);

    const {
        appName = getAppTitle(config.getConfig(), platform),
        https = false,
        subdomainAddition,
        environment = 'staging',
        domain,
        region = 'eu-west-1'
    } = selectedSchemeAwsSettings;

    if (!domain || !appName) throw new Error(`renative.json platforms.${platform}.buildSchemes.${scheme}.awsDeploy object is missing required params domain or appName`);

    const bucket = `${appName}.${subdomainAddition ? `${subdomainAddition}.` : ''}${environment}.${domain}`;
    const url = `${https ? 'https' : 'http'}://${bucket}/${platform}-${scheme}-${version}/index.html`;

    await Deployer.initialize(region);
    const basePath = `${paths.project.builds.dir}/${runtime.appId}_${platform}`;
    const deployPath = `${basePath}/public`;

    await Deployer.deployVersion(bucket, `${platform}-${scheme}-${version}`, url, deployPath);

    console.log('deployed', url);
};

const doDeploy = async () => {
    const rnvPath = await getInstalledPath('rnv', { local: false });
    const config = require(path.join(rnvPath, 'dist/config')).default;

    const { files } = config.getConfig();
    const version = `v${files.project.package.version}`;

    await deployToAWS(version);
    await deployToAWS('latest');
};

export default doDeploy;

// FOR REFERENCE


// PROGNAME=$0
// SCRIPTDIR=$(dirname `realpath -s $0`)

// #TODO: bucket objectRetentionPolicy.json, where art thou


// usage()
// {
//   cat << EOF >&2
// Usage: $nextgenBuckets createBucket   [-a <application_name>] [-c <client_name>] [-e <env>] [[-s <aws_access_key>  -k <aws_secret_access_key>]]
//        $nextgenBuckets deployVersion  [-a <application_name>] [-c <client_name>] [-e <env>] [-n <version_id>] [-d <sources_dir>] [[-s <aws_access_key>  -k <aws_secret_access_key>]]
//        $nextgenBuckets createVersion  [-a <application_name>] [-c <client_name>] [-e <env>] [-n <version_id>] [-d <sources_dir>] [[-s <aws_access_key>  -k <aws_secret_access_key>]]
//        $nextgenBuckets createDistrib  [-a <application_name>] [-c <client_name>] [-e <env>] [[-s <aws_access_key>  -k <aws_secret_access_key>]]
//        $nextgenBuckets delegateDomain [-c <client_name>] [-e <env>] [[-s <aws_access_key>  -k <aws_secret_access_key>]]
//        $nextgenBuckets createCert     [-c <client_name>] [-e <env>] [[-s <aws_access_key>  -k <aws_secret_access_key>]]
//  -e <environment>: staging, prod, dev
//  -a <application_name>: web,tizen,webos,service-configurator
//  -c <client_name>
//  -n <version_id>
//  -d <sources_dir>
//  -s <aws_access_key>
//  -k <aws_secret_access_key>
// EOF
//   exit 1
// }
// while [ $# -gt 0 ]; do
//   while getopts ":e:a:c:n:d:s:k:" o; do
//     case "$o" in
//       (e) environment=$OPTARG; shift;;
//       (a) application_name=$OPTARG; shift;;
//       (c) client_name=$OPTARG; shift;;
//       (n) version_id=$OPTARG; shift;;
//       (d) sources_dir=$OPTARG; shift;;
//       (s) aws_access_key=$OPTARG;  shift;;
//       (k) aws_secret_access_key=$OPTARG;  shift;;
//       *) usage;;
//     esac
//     shift
//     OPTIND=1
//   done
//   if [ $# -gt 0 ]; then
//     POSITIONALPARAM=(${POSITIONALPARAM[@]} $1)
//     shift
//     OPTIND=1
//   fi
// done


// #Global script vars
// domain="24imedia.com"
// bucketRegion="eu-west-1"


// #- Initializes a private S3 bucket.
// #  Only permissions applied via local IAM policies and groups
// #  can provide access to the bucket
// #- Prevents other AWS services from updating the policy to allow
// #  public access
// function createBucket()
// {
//   #Buket ACL root identity
//   s3_root_identity="3086b76b6a1d005c5bccad5dc86833079a55cb50b75790a8b365e7eee61a36fb"

//   #Create bucket. Delegate permissions to local IAM
//   echo Creating bucket and setting grant to local IAM
//   aws s3api create-bucket \
//   --bucket "$application_name.$client_name.$environment.$domain" \
//   --create-bucket-configuration LocationConstraint=$bucketRegion \
//   --grant-full-control id="`echo $s3_root_identity`" 1> /dev/null
//   echo

//   #Remove ability to initialize public settings in policy file
//   echo Removing public access to bucket and objects
//   aws s3api put-public-access-block \
//   --bucket "$application_name.$client_name.$environment.$domain" \
//   --cli-input-json fileb://$SCRIPTDIR/bucketPublicAccessBlock.json 1> /dev/null
//   echo

//   #Add bucket name to CF policy template for getObject access
//   jq '.Statement[0].Resource="arn:aws:s3:::'$application_name.$client_name.$environment.$domain'/*"' \
//   $SCRIPTDIR/bucketPolicy.json > /tmp/bucketPolicy.temp.json
//   echo

//   #Apply policy
//   echo Allowing CloudFront read access to bucket objects
//   aws s3api put-bucket-policy \
//   --bucket  "$application_name.$client_name.$environment.$domain" \
//   --policy file:///tmp/bucketPolicy.temp.json 1> /dev/null


//   #Apply an object retention policy for non-arod buckets
//   # if [[ $environment =~ "staging" ]]
//   # then
//   #   aws s3api put-bucket-lifecycle-configuration \
//   #   --bucket "$application_name.$client_name.$environment.$domain" \
//   #   --lifecycle-configuration file://objectRetentionPolicy.json
//   # fi

//   echo Bucket created "successfully"
//   echo
//   createDistrib
// }


// #Creates a cloudfront distribution
// #The following settings are hard-set in cloudfront.json:
// #AWS org account ID
// #CloudFront S3 OUI
// #Number of origins, aliases, origin group
// #Query string and cookie forwarding
// #Forced 0 TTL (no-cache) for default cache behaviour header settings
// #TLS ciphersuite policy set from CF standard TLSv1.1_2016 to S3-compatible TLSv1_2016
// #Viwer protocol policy set to match viewer
// #Price class
// function createDistrib
// {
//   #Add cert common name to distribution alias
//   cf_config=$(jq '.DistributionConfig.Aliases.Items[0]="'$application_name.$client_name.$environment.$domain'"' \
//                  $SCRIPTDIR/cloudfront.json)

//   #Get ACM cert
//   cert_arn=$(aws acm --region us-east-1 list-certificates |\
//              jq -r '.CertificateSummaryList[] |
//              select(.DomainName=="'$client_name.$environment.$domain'") |
//              .CertificateArn')
//   #ACM settings
//   cf_config=$(jq '.DistributionConfig.ViewerCertificate.ACMCertificateArn="'$cert_arn'"' <<< $cf_config)
//   cf_config=$(jq '.DistributionConfig.ViewerCertificate.Certificate="'$cert_arn'"' <<< $cf_config)


//   #Origin settings
//   cf_config=$(jq '.DistributionConfig.Origins.Items[0].Id="S3-'$application_name.$client_name.$environment.$domain'"' <<< $cf_config)
//   cf_config=$(jq '.DistributionConfig.Origins.Items[0].DomainName="'$application_name.$client_name.$environment.$domain'.s3.amazonaws.com"' <<< $cf_config)

//   #Cache behaviour settings
//   cf_config=$(jq '.DistributionConfig.DefaultCacheBehavior.TargetOriginId="S3-'$application_name.$client_name.$environment.$domain'"' <<< $cf_config)

//   #Generate a caller reference
//   millis=$(date +%s)
//   cf_config=$(jq '.DistributionConfig.CallerReference="'$millis'"' <<< $cf_config)

//   #Create the distribution
//   echo Starting up CloudFront distribution
//   jq '.' <<< $cf_config > /tmp/cloudfront.temp.json
//   distrib_response=$(aws cloudfront create-distribution \
//                      --cli-input-json fileb:///tmp/cloudfront.temp.json |\
//                      jq '.')
//   distrib_domain=$(jq -r '.Distribution.DomainName' <<< $distrib_response)
//   distrib_id=$(jq -r '.Distribution.Id' <<< $distrib_response)
//   echo Check when the distribution is available with: "aws cloudfront  get-distribution --id $distrib_id | jq -r '.Distribution.Status'"

//   client_dns_zone_id=$(aws route53 list-hosted-zones |\
//                        jq -r '.HostedZones[] |
//                               select(.Name=="'$client_name.$environment.$domain'.") | .Id' |\
//                        cut -d'/' -f3)
//   createDnsRecord CNAME $application_name.$client_name.$environment.$domain $distrib_domain $client_dns_zone_id
// }


// #Generates a certificate for cloudfront
// function createCert
// {
//   #Request the certificate in N.Virginia
//   echo Reserving ceritifcate
//   certificate_arn=$(aws --region us-east-1 acm request-certificate \
//                     --domain-name "$client_name.$environment.$domain" \
//                     --subject-alternative-names "*.$client_name.$environment.$domain" \
//                     --validation-method DNS |\
//                     jq -r '.CertificateArn' )
//   sleep 20

//   #Get cert
//   certificate=$(aws --region us-east-1 \
//                 acm describe-certificate \
//                 --certificate-arn "$certificate_arn")

//   # #Extract validation records
//   validation_name=$(jq -r '.Certificate.DomainValidationOptions[0].ResourceRecord.Name' <<< $certificate)
//   validation_value=$(jq -r '.Certificate.DomainValidationOptions[0].ResourceRecord.Value' <<< $certificate)

//   # #Get client dns zone
//   client_dns_zone_id=$(aws route53 list-hosted-zones |\
//                        jq -r '.HostedZones[] |
//                               select(.Name=="'$client_name.$environment.$domain'.") | .Id' |\
//                        cut -d'/' -f3)
//   createDnsRecord CNAME $validation_name $validation_value $client_dns_zone_id
// }


// #Creates an S3 key without an object
// function createVersion()
// {
//   aws s3api put-object \
//   --bucket "$application_name.$client_name.$environment.$domain" \
//   --key "$version_id"/

//   echo Version URL: http://$application_name.$client_name.$environment.$domain/$version_id/index.html
// }


// function deployVersion()
// {

//   #Force-delete S3 version folder if it exists. Required for CloudFront to honour HTTP no-cache
//   echo Removing existing version files
//   aws s3 rm \
//   --recursive s3://$application_name.$client_name.$environment.$domain/$version_id 1> /dev/null

//   #Upload version files
//   echo Uploading new version files
//   aws s3 cp \
//   --recursive $sources_dir \
//   s3://$application_name.$client_name.$environment.$domain/$version_id 1> /dev/null

//   #Update root of bucket index.html to point to latest version
//   echo Updating index.html at root of bucket to point to the new version
//   echo -n '<body><head><meta http-equiv="refresh" content="0; ' > /tmp/index.temp.html
//   echo 'URL=http://'$application_name.$client_name.$environment.$domain/$version_id'/index.html" /></head></body>' \
//   >> /tmp/index.temp.html

//   aws s3 rm \
//   s3://$application_name.$client_name.$environment.$domain/index.html 1> /dev/null

//   aws s3 cp \
//   /tmp/index.temp.html s3://$application_name.$client_name.$environment.$domain/index.html 1> /dev/null


//   #Check version folder exists and its index.html is present via S3 API
//   versionExists=False
//   versionAPILookup=$(aws s3api list-objects \
//                      --bucket $application_name.$client_name.$environment.$domain |\
//                      jq -r '.Contents[] | select(.Key=="'$version_id'/index.html")')
//   [[ -n "$versionAPILookup" ]] && versionExists=True || versionExists=False

//   #Get HTTP headers and index page html
//   versionHTTPGet=$(curl -sLD- http://$application_name.$client_name.$environment.$domain/$version_id/index.html)
//   [[ "$versionHTTPGet" =~ ^HTTP/[0-9.]{3,}[[:space:]]200 ]] && \
//      versionExists=True || versionExists=False

//   #Check HTML body has webpack JS
//   [[ "$versionHTTPGet" =~ (fetch).*(polyfill).*(bundle) ]] && \
//      versionExists=True || versionExists=False

//   if [[ $versionExists = "True" ]]
//   then
//     echo Version URL: http://$application_name.$client_name.$environment.$domain/$version_id/index.html
//     return 0
//   else
//     echo Something went wrong. Version files cannot be retrieved
//     return 1
//   fi
// }


// #$1: Type
// #$2: Name
// #$3: Value
// #$4: Hosted zone ID
// function createDnsRecord
// {
//   dns_call=$(jq '.Changes[0].ResourceRecordSet.Type="'$1'"' $SCRIPTDIR/dns.json)
//   dns_call=$(jq '.Changes[0].ResourceRecordSet.Name="'$2'"' <<< $dns_call)
//   dns_call=$(jq '.Changes[0].ResourceRecordSet.ResourceRecords[0].Value="'$3'"' <<< $dns_call)
//   jq '.' <<< $dns_call > /tmp/dns.temp.json

//   aws route53 change-resource-record-sets \
//   --hosted-zone-id "$4" \
//   --change-batch file:///tmp/dns.temp.json 1> /dev/null
// }


// function delegateSubdomain
// {
//   #Create domain
//   domain_crt_resp=$(aws route53 create-hosted-zone \
//                     --name $client_name.$environment.$domain \
//                     --caller-reference $(date +%s))

//   #Get allocated SOA server
//   soa_nameServer=$(jq -r '.DelegationSet.NameServers[0]' <<< $domain_crt_resp)

//   #Update parent zone $DTAP.24imedia.com with an NS record for acme.$DTAP.24imedia.com
//   #Get parent
//   parent_hosted_zone=$(aws route53 list-hosted-zones |\
//                        jq -r '.HostedZones[] |
//                               select(.Name=="'$environment.$domain'.") |
//                               .Id' |\
//                        cut -d'/' -f3)

//   #Update parent with NS record for server seen in SOA
//   createDnsRecord NS $client_name.$environment.$domain. $soa_nameServer $parent_hosted_zone

// }


// #Run
// #Check if API keys have been passed in params s and k. If not, do not init envVars,
// #because they obsolete config file lookups
// [[ -n $aws_access_key && -n $aws_secret_access_key ]] && \
//   export AWS_ACCESS_KEY_ID=$aws_access_key AWS_SECRET_ACCESS_KEY=$aws_secret_access_key
// [[ $POSITIONALPARAM[0] =~ createBucket ]] && createBucket
// [[ $POSITIONALPARAM[0] =~ createCert ]] && createCert
// [[ $POSITIONALPARAM[0] =~ createDistrib ]] && createDistrib
// [[ $POSITIONALPARAM[0] =~ deployVersion ]] && deployVersion
// [[ $POSITIONALPARAM[0] =~ createDNSDomin ]] && createDNSDomin
// #Cleanup
// unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY
