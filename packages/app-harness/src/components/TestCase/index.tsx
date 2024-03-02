import { Text, View } from 'react-native';

export const TestCase = ({ children, title, id }) => {
    return (
        <View
            style={{
                width: '100%',
                marginVertical: 5,
                borderWidth: 1,
                borderColor: '#ccc',
            }}
        >
            <View style={{ backgroundColor: '#111', height: 30, padding: 5, marginBottom: 10 }}>
                <Text style={{ color: 'white' }}>{`#${id}: ${title}`}</Text>
            </View>
            <View style={{ flex: 1, padding: 10, minHeight: 50 }}>{children}</View>
        </View>
    );
};
