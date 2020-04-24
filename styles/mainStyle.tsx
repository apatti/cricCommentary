import {StyleSheet} from "react-native";

export const mainStyles = StyleSheet.create({
    root:{
        alignItems: 'center',
        alignSelf: 'center'
    },
    buttons: {
        flexDirection: 'row',
        minHeight: 70,
        alignItems: 'stretch',
        alignSelf: 'center',
        borderWidth: 5,
    },
    button: {
        flex: 1,
        paddingVertical: 0,
    },
    title: {
        color: '#999',
        fontWeight: 'bold'
    },
    commentaryRow: {
        flexDirection: 'row'
    }
});
