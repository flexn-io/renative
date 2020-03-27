module.exports.settings = () => ({
    OutputGroups: [
        {
            CustomName: '1080p',
            Name: 'Apple HLS',
            Outputs: [
                {
                    Preset: 'System-Avc_16x9_1080p_29_97fps_8500kbps',
                    NameModifier: '1080p'
                }
            ],
            OutputGroupSettings: {
                Type: 'HLS_GROUP_SETTINGS',
                HlsGroupSettings: {
                    ManifestDurationFormat: 'INTEGER',
                    SegmentLength: 10,
                    TimedMetadataId3Period: 10,
                    CaptionLanguageSetting: 'OMIT',
                    Destination: 's3://#{AWS::AccountId}-${self:custom.currentStage}-video-output/',
                    TimedMetadataId3Frame: 'PRIV',
                    CodecSpecification: 'RFC_4281',
                    OutputSelection: 'MANIFESTS_AND_SEGMENTS',
                    ProgramDateTimePeriod: 600,
                    MinSegmentLength: 0,
                    MinFinalSegmentLength: 0,
                    DirectoryStructure: 'SINGLE_DIRECTORY',
                    ProgramDateTime: 'EXCLUDE',
                    SegmentControl: 'SEGMENTED_FILES',
                    ManifestCompression: 'NONE',
                    ClientCache: 'ENABLED',
                    StreamInfResolution: 'INCLUDE'
                }
            }
        },
        {
            CustomName: '720p',
            Name: 'Apple HLS',
            Outputs: [
                {
                    Preset: 'System-Avc_16x9_720p_29_97fps_3500kbps',
                    NameModifier: '720p'
                }
            ],
            OutputGroupSettings: {
                Type: 'HLS_GROUP_SETTINGS',
                HlsGroupSettings: {
                    ManifestDurationFormat: 'INTEGER',
                    SegmentLength: 10,
                    TimedMetadataId3Period: 10,
                    CaptionLanguageSetting: 'OMIT',
                    Destination: 's3://#{AWS::AccountId}-${self:custom.currentStage}-video-output/',
                    TimedMetadataId3Frame: 'PRIV',
                    CodecSpecification: 'RFC_4281',
                    OutputSelection: 'MANIFESTS_AND_SEGMENTS',
                    ProgramDateTimePeriod: 600,
                    MinSegmentLength: 0,
                    MinFinalSegmentLength: 0,
                    DirectoryStructure: 'SINGLE_DIRECTORY',
                    ProgramDateTime: 'EXCLUDE',
                    SegmentControl: 'SEGMENTED_FILES',
                    ManifestCompression: 'NONE',
                    ClientCache: 'ENABLED',
                    StreamInfResolution: 'INCLUDE'
                }
            }
        }
    ],
    AdAvailOffset: 0,
    Inputs: [
        {
            AudioSelectors: {
                'Audio Selector 1': {
                    Offset: 0,
                    DefaultSelection: 'DEFAULT',
                    ProgramSelection: 1
                }
            },
            VideoSelector: {
                ColorSpace: 'FOLLOW',
                Rotate: 'DEGREE_0',
                AlphaBehavior: 'DISCARD'
            },
            FilterEnable: 'AUTO',
            PsiControl: 'USE_PSI',
            FilterStrength: 0,
            DeblockFilter: 'DISABLED',
            DenoiseFilter: 'DISABLED',
            TimecodeSource: 'EMBEDDED'
        }
    ]
});
