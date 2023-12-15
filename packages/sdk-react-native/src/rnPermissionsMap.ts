const permissionsMap: Record<string, { podPermissionKey: string }> = {
    NSAppleMusicUsageDescription: {
        podPermissionKey: 'MediaLibrary',
    },
    NSBluetoothPeripheralUsageDescription: {
        podPermissionKey: 'BluetoothPeripheral',
    },
    NSCalendarsUsageDescription: {
        podPermissionKey: 'Calendars',
    },
    NSCameraUsageDescription: {
        podPermissionKey: 'Camera',
    },
    NSLocationWhenInUseUsageDescription: {
        podPermissionKey: 'LocationWhenInUse',
    },
    NSLocationAlwaysAndWhenInUseUsageDescription: {
        podPermissionKey: 'LocationAccuracy',
    },
    NSLocationAlwaysUsageDescription: {
        podPermissionKey: 'LocationAlways',
    },
    NSMicrophoneUsageDescription: {
        podPermissionKey: 'Microphone',
    },
    NSMotionUsageDescription: {
        podPermissionKey: 'Motion',
    },
    NSPhotoLibraryAddUsageDescription: {
        podPermissionKey: 'PhotoLibraryAddOnly',
    },
    NSPhotoLibraryUsageDescription: {
        podPermissionKey: 'PhotoLibrary',
    },
    NSSpeechRecognitionUsageDescription: {
        podPermissionKey: 'SpeechRecognition',
    },
    NSContactsUsageDescription: {
        podPermissionKey: 'Contacts',
    },
    NSFaceIDUsageDescription: {
        podPermissionKey: 'FaceID',
    },
    NSBluetoothAlwaysUsageDescription: {
        podPermissionKey: 'BluetoothPeripheral',
    },
};

export default permissionsMap;
