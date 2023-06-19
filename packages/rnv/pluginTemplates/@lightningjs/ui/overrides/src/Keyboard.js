/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2021 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Lightning from '@lightningjs/core';

import KeyWrapper from './helpers/KeyWrapper.js';
import Key from './Key.js';

export default class Keyboard extends Lightning.Component {
    static _template() {
        return {
            collision: true,
            Keys: {
                collision: true,
                w: w => w
            }
        }
    }

    _construct() {
        this._input = '';
        this._inputField = undefined;
        this._maxCharacters = 56;
        this.navigationWrapAround = false;
        this.resetFocus();
    }

    resetFocus() {
        this._columnIndex = 0;
        this._rowIndex = 0;
        this._previousKey = null;
    }

    _setup() {
        this._keys = this.tag('Keys');
        this._update();
    }

    _update() {
        const {layouts, buttonTypes = {}, styling = {}} = this._config;
        if(!this._layout || (this._layout && layouts[this._layout] === undefined)) {
            console.error(`Configured layout "${this._layout}" does not exist. Picking first available: "${Object.keys(layouts)[0]}"`);
            this._layout = Object.keys(layouts)[0];
        }
        const {horizontalSpacing = 0, verticalSpacing = 0, align = 'left'} = styling;
        let rowPosition = 0;
        const isEvent = /^[A-Z][A-Za-z0-9]{1}/;
        const hasLabel = /\:/;

        if(buttonTypes.default === undefined) {
            buttonTypes.default = Key;
        }

        this._keys.children = layouts[this._layout].map((row, rowIndex) => {
            const {
                x = 0,
                margin = 0,
                marginRight,
                marginLeft,
                marginTop,
                marginBottom,
                spacing: rowHorizontalSpacing = horizontalSpacing || 0,
                align: rowAlign = align
            } = styling[`Row${rowIndex+1}`] || {};

            let keyPosition = 0;
            let rowHeight = 0;
            const rowKeys = row.map((key, keyIndex) => {
                const origin = key;
                let keyType = buttonTypes.default;
                let action = 'Input';
                let label = key;

                if(isEvent.test(key)) {
                    if(hasLabel.test(key)) {
                        key = key.split(':');
                        label = key[1].toString();
                        key = key[0];
                    }
                    if(buttonTypes[key]) {
                        keyType = buttonTypes[key];
                        action = key.action || key;
                    }
                }

                const keySpacing = keyType.margin || keyType.type.margin;
                const {
                    w = keyType.type.width || 0,
                    h = keyType.type.height || 0,
                    marginLeft = keyType.type.marginLeft || keySpacing || 0,
                    marginRight = keyType.type.marginRight || keySpacing || rowHorizontalSpacing,
                } = keyType;

                rowHeight = h > rowHeight ? h : rowHeight;
                const currentPosition = keyPosition + marginLeft;
                keyPosition += marginLeft + w + marginRight;
                return {ref: `Key-{${keyIndex + 1}}`, type: KeyWrapper, keyboard: this, x: currentPosition, w, h, key: {data: {origin, key, label, action}, w, h, ...keyType}}
            });

            let rowOffset = x + (marginLeft || margin);
            let rowMount = 0;

            if(this.w && rowAlign === 'center') {
                rowOffset = this.w / 2;
                rowMount = 0.5;
            }

            if(this.w && rowAlign === 'right') {
                rowOffset = this.w - (marginRight || margin);
                rowMount = 1;
            }

            const currentPosition = rowPosition + (marginTop|| margin);
            rowPosition = currentPosition + rowHeight + (marginBottom || margin || verticalSpacing);
            return {
                ref: `Row-${rowIndex + 1}`,
                x: rowOffset,
                mountX: rowMount,
                w: keyPosition,
                y: currentPosition,
                children: rowKeys
            }
        });
        this._refocus();
    }

    _getFocused() {
        return this.currentKeyWrapper || this;
    }

    _handleHover() {
        return this.currentKeyWrapper || this;
    }

    _handleRight() {
        return this.navigate('row', 1);
    }

    _handleLeft() {
        return this.navigate('row', -1);
    }

    _handleUp() {
        return this.navigate('column', -1);
    }

    _handleDown() {
        return this.navigate('column', 1);
    }

    _handleKey({key, code = 'CustomKey'}) {
        if(code === 'Backspace' && this._input.length === 0) {
            return false;
        }
        if(key === ' ') {
            key = 'Space';
        }
        const targetFound = this._findKey(key);
        if(targetFound) {
            this._handleEnter();
        }
        return targetFound;
    }

    _findKey(str) {
        const rows = this._config.layouts[this._layout];
        let i = 0, j = 0;
        for(; i < rows.length; i++) {
            for (j = 0; j < rows[i].length; j++) {
                let key = rows[i][j];
                if((str.length > 1 && key.indexOf(str) > -1) || key.toUpperCase() === str.toUpperCase()) {
                    this._rowIndex = i;
                    this._columnIndex = j;
                    return true;
                }
            }
        }
        return false;
    }

    $onKeyWrapperClick(currentKey) {
        const {origin, action} = currentKey;
        const event = {
            index: this._input.length,
            key: origin
        };
        if(this._inputField && this._inputField.cursorIndex) {
            event.index = this._inputField.cursorIndex;
        }
        if(action !== 'Input') {
            const split = event.key.split(':')
            const call = `on${split[0]}`;
            const eventFunction = this[call];
            event.key = split[1];
            if(eventFunction && eventFunction.apply && eventFunction.call) {
                eventFunction.call(this, event);
            }
            this.signal(call, {input: this._input, keyboard: this, ...event});
        }
        else {
            this.addAt(event.key, event.index);
        }
    }

    _onPressAction() {
        const {origin, action} = this.currentKey.data;
        const event = {
            index: this._input.length,
            key: origin
        };
        if(this._inputField && this._inputField.cursorIndex) {
            event.index = this._inputField.cursorIndex;
        }
        if(action !== 'Input') {
            const split = event.key.split(':')
            const call = `on${split[0]}`;
            const eventFunction = this[call];
            event.key = split[1];
            if(eventFunction && eventFunction.apply && eventFunction.call) {
                eventFunction.call(this, event);
            }
            this.signal(call, {input: this._input, keyboard: this, ...event});
        }
        else {
            this.addAt(event.key, event.index);
        }
    }

    _handleEnter() {
        this._onPressAction();
    }

    _handleClick() {
        this._onPressAction();
    }


    _changeInput(input) {
        if(input.length > this._maxCharacters) {
            return;
        }
        const eventData = {
            previousInput: this._input,
            input: this._input = input
        };
        if(this._inputField && this._inputField.onInputChanged) {
            this._inputField.onInputChanged(eventData);
        }
        this.signal('onInputChanged', eventData);
    }

    focus(str) {
        this._findKey(str);
    }

    add(str) {
        this._changeInput(this._input + str);
    }

    addAt(str, index) {
        if(index > this._input.length - 1) {
            this.add(str);
        }
        else if(index > -1) {
            this._changeInput(this._input.substring(0, index) + str + this._input.substring(index, this._input.length));
        }
    }

    remove() {
        this._changeInput(this._input.substring(0, this._input.length - 1));
    }

    removeAt(index) {
        if(index > this._input.length - 1) {
            this.remove();
        }
        else if(index > -1) {
            this._changeInput(this._input.substring(0, index-1) + this._input.substring(index, this._input.length));
        }
    }

    clear() {
        this._changeInput('');
    }

    layout(key) {
        if(key === this._layout) {
            return;
        }
        this._layout = key;
        if(this.attached) {
            this.resetFocus();
            this._update();
        }
    }

    inputField(component) {
        if(component && component.isComponent) {
            this._rowIndex = 0;
            this._columnIndex = 0;
            this._input = component.input !== undefined? component.input : '';
            this._inputField = component;
        }
        else {
            this._rowIndex = 0;
            this._columnIndex = 0;
            this._input = ''
            this._inputField = undefined;
        }
    }

    navigate(direction, shift) {
        const targetIndex = (direction === 'row' ? this._columnIndex : this._rowIndex) + shift;
        const currentRow = this.rows[this._rowIndex];
        if(direction === 'row' && targetIndex > -1 && targetIndex < currentRow.children.length) {
            this._previous = null;
            return this._columnIndex = targetIndex;
        } else if (direction === 'row' && this.navigationWrapAround) {
            this._previous = null;
            let rowLen = currentRow.children.length
            return this._columnIndex = (targetIndex%rowLen + rowLen)%rowLen
        }
        if(direction === 'column' && targetIndex > -1 && targetIndex < this.rows.length ) {
            const currentRowIndex = this._rowIndex;
            const currentColumnIndex = this._columnIndex;
            if(this._previous && this._previous.row === targetIndex) {
                const tmp = this._previous.column;
                this._previous.column = this._columnIndex;
                this._columnIndex = tmp;
                this._rowIndex = this._previous.row;
            }
            else {
                const targetRow = this.rows[targetIndex];
                const currentKey = this.currentKeyWrapper;
                const currentRow = this.rows[this._rowIndex];
                const currentX = currentRow.x - (currentRow.w * currentRow.mountX)  + currentKey.x;
                const m = targetRow.children.map((key) => {
                    const keyX = targetRow.x - (targetRow.w * targetRow.mountX) + key.x;
                    if(keyX <= currentX && currentX < keyX + key.w) {
                        return (keyX + key.w) - currentX;
                    }
                    if(keyX >= currentX && keyX <= currentX + currentKey.w) {
                        return (currentX + currentKey.w) - keyX;
                    }
                    return -1;
                });
                let acc = -1;
                let t = -1;

                for(let i = 0; i < m.length; i++) {
                    if(m[i] === -1 && acc > -1) {
                        break;
                    }
                    if(m[i] > acc) {
                        acc = m[i];
                        t = i;
                    }
                }
                if(t > -1) {
                    this._rowIndex = targetIndex;
                    this._columnIndex = t;
                } // if no next row found and wraparound is on, loop back to first row
                else if(this.navigationWrapAround){
                    this._columnIndex = Math.min(this.rows[0].children.length-1, this._columnIndex)
                    return this._rowIndex = 0;
                }
            }
            if(this._rowIndex !== currentRowIndex) {
                this._previous = {column: currentColumnIndex, row: currentRowIndex};
                return this._rowIndex = targetIndex;
            }
        }
        else if(direction === 'column' && this.navigationWrapAround){
          this._previous = {column: this._columnIndex, row: this._rowIndex};
          let nrRows = this.rows.length
          this._rowIndex = (targetIndex%nrRows + nrRows)%nrRows
          this._columnIndex = Math.min(this.rows[this._rowIndex].children.length-1, this._columnIndex)
        }
        return false;
    }

    onSpace({index}) {
        this.addAt(' ', index);
    }

    onBackspace({index}) {
        this.removeAt(index);
    }

    onClear() {
        this.clear();
    }

    onLayout({key}) {
        this.layout(key);
    }

    set config(obj) {
        this._config = obj;
        if(this.active) {
            this._update();
        }
    }

    get config() {
        return this._config;
    }

    set currentInputField(component) {
        this.inputField(component);
    }

    get currentInputField() {
        return this._inputField;
    }

    set currentLayout(str) {
        this.layout(str);
    }

    get currentLayout() {
        return this._layout;
    }

    set maxCharacters(num) {
        this._maxCharacters = num;
    }

    get maxCharacters() {
        return this._maxCharacters;
    }

    get rows() {
        return this._keys && this._keys.children;
    }

    get currentKeyWrapper() {
        return this.rows && this.rows[this._rowIndex].children[this._columnIndex];
    }

    get currentKey() {
        return this.currentKeyWrapper && this.currentKeyWrapper.key
    }
}