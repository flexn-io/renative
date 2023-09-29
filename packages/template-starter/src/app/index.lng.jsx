import { Text, View } from '@lightningjs/solid';
import { useFocusManager } from '@lightningjs/solid-primitives';
import { Route, Routes, useNavigate } from '@solidjs/router';

const HelloWorld = () => {
    return (
        <>
            <Text
                autofocus
                style={{
                    width: 1920,
                    height: 170,
                    lineHeight: 170,
                    y: 455,
                    contain: 'both',
                    fontSize: 100,
                    textAlign: 'center',
                }}
            >
                Hello World!
            </Text>
            <Text
                style={{
                    width: 1920,
                    height: 170,
                    lineHeight: 170,
                    y: 655,
                    contain: 'both',
                    fontSize: 60,
                    textAlign: 'center',
                }}
            >
                Press B for buttons, T for Text pages, M for here
            </Text>
        </>
    );
};
const App = () => {
    useFocusManager({
        m: 'Menu',
        t: 'Text',
        b: 'Buttons',
    });
    const navigate = useNavigate();

    return (
        <View
            ref={window.APP}
            aria-label={'Hello World'}
            onLast={() => history.back()}
            onText={() => navigate('/text')}
            onButtons={() => navigate('/buttons')}
            onMenu={() => navigate('/')}
            style={{ width: 1920, height: 1080 }}
        >
            <View color="#071423" style={{ width: 1920, height: 1080 }} />
            <Routes>
                <Route path="/" component={HelloWorld} />
                {/* <Route path="/text" component={TextPage} />
        <Route path="/buttons" component={ButtonsPage} />
        <Route path="/*all" component={NotFound} /> */}
            </Routes>
        </View>
    );
};

export default App;
