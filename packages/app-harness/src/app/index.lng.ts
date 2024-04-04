import Lightning from "@lightningjs/core";

export default class App extends Lightning.Component {
    static _template() {
        return {
            RoundedRectangle: {
                texture: Lightning.Tools.getRoundRect(100, 10, 4),
            },
        };
    }
}
