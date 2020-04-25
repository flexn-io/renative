import React from 'react';
import { View, Text, ScrollView, TextInput, Image, Button, ActivityIndicator,
    ImageBackground, ProgressViewIOS, Switch, DatePickerIOS, ViewPagerAndroid } from 'react-native';
import { Api, registerFocusManger, registerServiceWorker } from 'renative';

registerFocusManger({ focused: 'border: 5px solid #62DBFB; border-radius:5px;' });
registerServiceWorker();
let AppContainer;

const Tile = ({ children, title }) => (
    <View style={{ margin: 5, maxWidth: 200, minWidth: 150, borderWidth: 1, borderColor: '#CCCCCC' }}>
        <Text>
            {title}
        </Text>
        <View style={{ borderTopWidth: 1, borderTopColor: '#CCCCCC', minHeight: 50, padding: 5 }}>
            {children}
        </View>
    </View>
);

const App = () => (
    <ScrollView contentContainerStyle={{ paddingTop: 50 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Tile title="Text">
                <Text>
Lorem Ipsum
                </Text>
            </Tile>
            <Tile title="Input">
                <TextInput />
            </Tile>
            <Tile title="Image">
                <Image
                    style={{ width: 50, height: 50 }}
                    source={{ uri: 'https://renative.org/img/logo.png' }}
                />
            </Tile>
            <Tile title="Button">
                <Button title="OK" />
            </Tile>
            <Tile title="ActivityIndicator">
                <ActivityIndicator />
            </Tile>
            <Tile title="ImageBackground">
                <ImageBackground source={{ uri: 'http://gis.mrrb.government.bg/tiles/mrr_vids/16/36914/23809.png' }} style={{ flex: 1 }}>
                    <Text>
Lorem Ipsum
                    </Text>
                </ImageBackground>
            </Tile>
            <Tile title="ProgressViewIOS">
                <ProgressViewIOS progress={0.8} />
            </Tile>

            <Tile title="ViewPager">
                <Text>
TODO
                </Text>
            </Tile>
            <Tile title="DatePickerIOS">
                <DatePickerIOS date={new Date()} />
            </Tile>
            <Tile title="Switch">
                <Switch />
            </Tile>
        </View>
    </ScrollView>
);

export default App;
