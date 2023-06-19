import { Picker } from '@react-native-picker/picker';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Keyboard, Modal, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { defaultStyles } from './styles';

export default class RNPickerSelect extends PureComponent {
    static propTypes = {
        onValueChange: PropTypes.func.isRequired,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                value: PropTypes.any.isRequired,
                inputLabel: PropTypes.string,
                key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                color: PropTypes.string,
            })
        ).isRequired,
        value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
        placeholder: PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.any,
            key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            color: PropTypes.string,
        }),
        disabled: PropTypes.bool,
        itemKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        style: PropTypes.shape({}),
        children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
        onOpen: PropTypes.func,
        useNativeAndroidPickerStyle: PropTypes.bool,
        fixAndroidTouchableBug: PropTypes.bool,

        // Custom Modal props (iOS only)
        doneText: PropTypes.string,
        onDonePress: PropTypes.func,
        onUpArrow: PropTypes.func,
        onDownArrow: PropTypes.func,
        onClose: PropTypes.func,

        // Modal props (iOS only)
        modalProps: PropTypes.shape({}),

        // TextInput props
        textInputProps: PropTypes.shape({}),

        // Picker props
        pickerProps: PropTypes.shape({}),

        // Touchable Done props (iOS only)
        touchableDoneProps: PropTypes.shape({}),

        // Touchable wrapper props
        holderProps: PropTypes.shape({}),

        // Custom Icon
        Icon: PropTypes.func,
        InputAccessoryView: PropTypes.func,
    };

    static defaultProps = {
        value: undefined,
        placeholder: {
            label: 'Select an item...',
            value: null,
            color: '#9EA0A4',
        },
        disabled: false,
        itemKey: null,
        style: {},
        children: null,
        useNativeAndroidPickerStyle: true,
        fixAndroidTouchableBug: false,
        doneText: 'Done',
        onDonePress: null,
        onUpArrow: null,
        onDownArrow: null,
        onOpen: null,
        onClose: null,
        modalProps: {},
        textInputProps: {},
        pickerProps: {},
        touchableDoneProps: {},
        holderProps: {},
        Icon: null,
        InputAccessoryView: null,
    };

    static handlePlaceholder({ placeholder }) {
        if (isEqual(placeholder, {})) {
            return [];
        }
        return [placeholder];
    }

    static getSelectedItem({ items, key, value }) {
        let idx = items.findIndex((item) => {
            if (item.key && key) {
                return isEqual(item.key, key);
            }
            return isEqual(item.value, value);
        });
        if (idx === -1) {
            idx = 0;
        }
        return {
            selectedItem: items[idx] || {},
            idx,
        };
    }

    constructor(props) {
        super(props);

        const items = RNPickerSelect.handlePlaceholder({
            placeholder: props.placeholder,
        }).concat(props.items);

        const { selectedItem } = RNPickerSelect.getSelectedItem({
            items,
            key: props.itemKey,
            value: props.value,
        });

        this.state = {
            items,
            selectedItem,
            showPicker: false,
            animationType: undefined,
            orientation: 'portrait',
            doneDepressed: false,
        };

        this.onUpArrow = this.onUpArrow.bind(this);
        this.onDownArrow = this.onDownArrow.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.onOrientationChange = this.onOrientationChange.bind(this);
        this.setInputRef = this.setInputRef.bind(this);
        this.togglePicker = this.togglePicker.bind(this);
        this.renderInputAccessoryView = this.renderInputAccessoryView.bind(this);
    }

    componentDidUpdate = (prevProps, prevState) => {
        // update items if items or placeholder prop changes
        const items = RNPickerSelect.handlePlaceholder({
            placeholder: this.props.placeholder,
        }).concat(this.props.items);
        const itemsChanged = !isEqual(prevState.items, items);

        // update selectedItem if value prop is defined and differs from currently selected item
        const { selectedItem, idx } = RNPickerSelect.getSelectedItem({
            items,
            key: this.props.itemKey,
            value: this.props.value,
        });
        const selectedItemChanged = !isEqual(this.props.value, undefined) && !isEqual(prevState.selectedItem, selectedItem);

        if (itemsChanged || selectedItemChanged) {
            this.props.onValueChange(selectedItem.value, idx);

            this.setState({
                ...(itemsChanged ? { items } : {}),
                ...(selectedItemChanged ? { selectedItem } : {}),
            });
        }
    };

    onUpArrow() {
        const { onUpArrow } = this.props;

        this.togglePicker(false, onUpArrow);
    }

    onDownArrow() {
        const { onDownArrow } = this.props;

        this.togglePicker(false, onDownArrow);
    }

    onValueChange(value, index) {
        const { onValueChange } = this.props;

        onValueChange(value, index);

        this.setState(prevState => ({
            selectedItem: prevState.items[index],
        }));
    }

    onOrientationChange({ nativeEvent }) {
        this.setState({
            orientation: nativeEvent.orientation,
        });
    }

    setInputRef(ref) {
        this.inputRef = ref;
    }

    getPlaceholderStyle() {
        const { placeholder, style } = this.props;
        const { selectedItem } = this.state;

        if (!isEqual(placeholder, {}) && selectedItem.label === placeholder.label) {
            return {
                ...defaultStyles.placeholder,
                ...style.placeholder,
            };
        }
        return {};
    }

    triggerOpenCloseCallbacks() {
        const { onOpen, onClose } = this.props;
        const { showPicker } = this.state;

        if (!showPicker && onOpen) {
            onOpen();
        }

        if (showPicker && onClose) {
            onClose();
        }
    }

    togglePicker(animate = false, postToggleCallback) {
        const { modalProps, disabled } = this.props;
        const { showPicker } = this.state;

        if (disabled) {
            return;
        }

        if (!showPicker) {
            Keyboard.dismiss();
        }

        const animationType = modalProps && modalProps.animationType ? modalProps.animationType : 'slide';

        this.triggerOpenCloseCallbacks();

        this.setState(
            prevState => ({
                animationType: animate ? animationType : undefined,
                showPicker: !prevState.showPicker,
            }),
            () => {
                if (postToggleCallback) {
                    postToggleCallback();
                }
            }
        );
    }

    renderPickerItems() {
        const { items } = this.state;

        return items.map(item => (
            <Picker.Item
                label={item.label}
                value={item.value}
                key={item.key || item.label}
                color={item.color}
            />
        ));
    }

    renderInputAccessoryView() {
        const {
            InputAccessoryView,
            doneText,
            onUpArrow,
            onDownArrow,
            onDonePress,
            style,
            testID,
            touchableDoneProps,
        } = this.props;

        const { doneDepressed } = this.state;

        if (InputAccessoryView) {
            return <InputAccessoryView testID="custom_input_accessory_view" />;
        }

        return (
            <View
                style={[defaultStyles.modalViewMiddle, style.modalViewMiddle]}
                testID="input_accessory_view"
            >
                <View style={[defaultStyles.chevronContainer, style.chevronContainer]}>
                    <TouchableOpacity
                        activeOpacity={onUpArrow ? 0.5 : 1}
                        onPress={onUpArrow ? this.onUpArrow : null}
                    >
                        <View
                            style={[
                                defaultStyles.chevron,
                                style.chevron,
                                defaultStyles.chevronUp,
                                style.chevronUp,
                                onUpArrow ? [defaultStyles.chevronActive, style.chevronActive] : {},
                            ]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={onDownArrow ? 0.5 : 1}
                        onPress={onDownArrow ? this.onDownArrow : null}
                    >
                        <View
                            style={[
                                defaultStyles.chevron,
                                style.chevron,
                                defaultStyles.chevronDown,
                                style.chevronDown,
                                onDownArrow
                                    ? [defaultStyles.chevronActive, style.chevronActive]
                                    : {},
                            ]}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    testID={testID ? `${testID}:done_button` : "done_button"}
                    onPress={() => {
                        this.togglePicker(true, onDonePress);
                    }}
                    onPressIn={() => {
                        this.setState({ doneDepressed: true });
                    }}
                    onPressOut={() => {
                        this.setState({ doneDepressed: false });
                    }}
                    hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}
                    {...touchableDoneProps}
                >
                    <View testID="needed_for_touchable">
                        <Text
                            testID="done_text"
                            allowFontScaling={false}
                            style={[
                                defaultStyles.done,
                                style.done,
                                doneDepressed
                                    ? [defaultStyles.doneDepressed, style.doneDepressed]
                                    : {},
                            ]}
                        >
                            {doneText}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    renderIcon() {
        const { style, Icon } = this.props;

        if (!Icon) {
            return null;
        }

        return (
            <View
                testID="icon_container"
                style={[defaultStyles.iconContainer, style.iconContainer]}
            >
                <Icon testID="icon" />
            </View>
        );
    }

    renderTextInputOrChildren() {
        const { children, style, textInputProps, testID } = this.props;
        const { selectedItem } = this.state;

        const containerStyle = Platform.OS === 'ios' ? style.inputIOSContainer : style.inputAndroidContainer;

        if (children) {
            return (
                <View pointerEvents="box-only" style={containerStyle}>
                    {children}
                </View>
            );
        }

        return (
            <View pointerEvents="box-only" style={containerStyle}>
                <TextInput
                    testID={testID ? `${testID}:text_input` : "text_input"}
                    style={[
                        Platform.OS === 'ios' ? style.inputIOS : style.inputAndroid,
                        this.getPlaceholderStyle(),
                    ]}
                    value={selectedItem.inputLabel ? selectedItem.inputLabel : selectedItem.label}
                    ref={this.setInputRef}
                    editable={false}
                    {...textInputProps}
                />
                {this.renderIcon()}
            </View>
        );
    }

    renderIOS() {
        const { style, modalProps, pickerProps, holderProps, testID } = this.props;
        const { animationType, orientation, selectedItem, showPicker } = this.state;

        return (
            <View style={[defaultStyles.viewContainer, style.viewContainer, holderProps?.style]}>
                <TouchableOpacity
                    testID={testID || "ios_touchable_wrapper"}
                    onPress={() => {
                        this.togglePicker(true);
                    }}
                    activeOpacity={1}
                >
                    {this.renderTextInputOrChildren()}
                </TouchableOpacity>
                <Modal
                    testID="ios_modal"
                    visible={showPicker}
                    transparent
                    animationType={animationType}
                    supportedOrientations={['portrait', 'landscape']}
                    onOrientationChange={this.onOrientationChange}
                    {...modalProps}
                >
                    <TouchableOpacity
                        style={[defaultStyles.modalViewTop, style.modalViewTop]}
                        testID="ios_modal_top"
                        onPress={() => {
                            this.togglePicker(true);
                        }}
                    />
                    {this.renderInputAccessoryView()}
                    <View
                        style={[
                            defaultStyles.modalViewBottom,
                            { height: orientation === 'portrait' ? 215 : 162 },
                            style.modalViewBottom,
                        ]}
                    >
                        <Picker
                            testID="ios_picker"
                            onValueChange={this.onValueChange}
                            selectedValue={selectedItem.value}
                            {...pickerProps}
                        >
                            {this.renderPickerItems()}
                        </Picker>
                    </View>
                </Modal>
            </View>
        );
    }

    renderAndroidHeadless() {
        const {
            disabled,
            style,
            pickerProps,
            onOpen,
            holderProps,
            fixAndroidTouchableBug,
            testID
        } = this.props;
        const { selectedItem } = this.state;

        const Component = fixAndroidTouchableBug ? View : TouchableOpacity;
        return (
            <Component
                testID={testID || "android_touchable_wrapper"}
                onPress={onOpen}
                activeOpacity={1}
                {...holderProps}
            >
                <View style={style.headlessAndroidContainer}>
                    {this.renderTextInputOrChildren()}
                    <Picker
                        style={[
                            { backgroundColor: 'transparent' }, // to hide native icon
                            defaultStyles.headlessAndroidPicker,
                            style.headlessAndroidPicker,
                        ]}
                        testID="android_picker_headless"
                        enabled={!disabled}
                        onValueChange={this.onValueChange}
                        selectedValue={selectedItem.value}
                        {...pickerProps}
                    >
                        {this.renderPickerItems()}
                    </Picker>
                </View>
            </Component>
        );
    }

    renderAndroidNativePickerStyle() {
        const { disabled, Icon, style, pickerProps, holderProps } = this.props;
        const { selectedItem } = this.state;

        return (
            <View style={[defaultStyles.viewContainer, style.viewContainer, holderProps.style]}>
                <Picker
                    style={[
                        Icon ? { backgroundColor: 'transparent' } : {}, // to hide native icon
                        style.inputAndroid,
                        this.getPlaceholderStyle(),
                    ]}
                    testID="android_picker"
                    enabled={!disabled}
                    onValueChange={this.onValueChange}
                    selectedValue={selectedItem.value}
                    {...pickerProps}
                >
                    {this.renderPickerItems()}
                </Picker>
                {this.renderIcon()}
            </View>
        );
    }

    renderWeb() {
        const { disabled, style, pickerProps, holderProps } = this.props;
        const { selectedItem } = this.state;

        return (
            <View style={[defaultStyles.viewContainer, style.viewContainer, holderProps.style]}>
                <Picker
                    style={[style.inputWeb]}
                    testID="web_picker"
                    enabled={!disabled}
                    onValueChange={this.onValueChange}
                    selectedValue={selectedItem.value}
                    {...pickerProps}
                >
                    {this.renderPickerItems()}
                </Picker>
                {this.renderIcon()}
            </View>
        );
    }

    render() {
        const { children, useNativeAndroidPickerStyle } = this.props;

        if (Platform.OS === 'ios') {
            return this.renderIOS();
        }

        if (Platform.OS === 'web') {
            return this.renderWeb();
        }

        if (children || !useNativeAndroidPickerStyle) {
            return this.renderAndroidHeadless();
        }

        return this.renderAndroidNativePickerStyle();
    }
}

export { defaultStyles };
