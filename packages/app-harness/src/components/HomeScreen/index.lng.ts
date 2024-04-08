import { Utils } from '@lightningjs/sdk';
import Lightning from '@lightningjs/core';
import { Api } from '@rnv/renative';
import config from '../../../package.json';

interface HomeTemplateSpec extends Lightning.Component.TemplateSpec {
    color: number;
}
export interface HomeTypeConfig extends Lightning.Component.TypeConfig {
    IsPage: true;
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
                w: 150,
                h: 150,
                src: Utils.asset('icon.png'),
                flexItem: { marginBottom: 50 },
            },
            Text1: this._renderText('ReNative Harness', 56, 'bold'),
            Text2: this._renderText(
                `v${config.version}, platform: ${Api.platform}, factor: ${Api.formFactor}, engine: ${Api.engine}`,
                25
            ),
        };
    }

    static _renderText(text: string, size: number, style = 'normal') {
        return {
            text: {
                text: text,
                fontSize: size,
                fontStyle: style,
                textColor: 0xff000000,
            },
        };
    }
}
