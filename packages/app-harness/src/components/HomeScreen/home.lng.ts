import { Lightning, Utils } from '@lightningjs/sdk';

interface HomeTemplateSpec extends Lightning.Component.TemplateSpec {
    color: number;
    Icons: {
        Icon2: typeof Icon;
    };
}
export interface HomeTypeConfig extends Lightning.Component.TypeConfig {
    IsPage: true;
}

class Icon extends Lightning.Component {
    static _template() {
        return {
            flexItem: { marginRight: 10, marginLeft: 10 },
            src: '',
            w: 60,
            h: 60,
        };
    }

    override _focus() {
        this.smooth = { scale: 1.2 };
    }

    _unfocus() {
        this.smooth = { scale: 1 };
    }
}

export default class Home
    extends Lightning.Component<HomeTemplateSpec, HomeTypeConfig>
    implements Lightning.Component.ImplementTemplateSpec<HomeTemplateSpec>
{
    static _template() {
        return {
            rect: true,
            w: 1920,
            h: 1080,
            color: 0xffffffff,
            flex: { justifyContent: 'center', direction: 'column', alignItems: 'center' } as const,
            Logo: {
                w: 200,
                h: 200,
                src: Utils.asset('logo.png'),
                flexItem: { marginBottom: 50 },
            },
            Text1: this._renderText('Flexn Create Example', 56),
        };
    }

    static _renderText(text: string, size: number) {
        return {
            text: {
                text: text,
                fontSize: size,
                textColor: 0xff000000,
            },
        };
    }
}
