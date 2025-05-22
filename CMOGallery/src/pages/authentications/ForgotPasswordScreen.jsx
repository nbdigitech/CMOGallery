import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/color';
import { useState } from 'react';
import commonStyle from '../components/Style';
import Footer from '../components/Footer';
import { isValidMobile, isStrongPassword } from '../../utils/Validation';
import { Alert } from 'react-native';
import { OtplessHeadlessModule } from 'otpless-headless-rn';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { baseUrl } from "../../services/apiConfig";

const ForgotPasswordScreen = () => {
    const [mobile, setMobile] = useState('');
    const [isInvalid, setIsInvalid] = useState({ mobile: false })
    const navigation = useNavigation();
    const [showResetForm, setShowResetForm] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const submitHandle = async () => {
        if (!isValidMobile(mobile)) {
            setIsInvalid({ ...isInvalid, mobile: true });
            return;
        }

        const exists = await checkUserExists();
        if (!exists) return; // ❌ stop if not in DB

        headlessModule.start({ phone: mobile.trim(), countryCode: "91" });
    };

    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = [
        useRef(null), useRef(null), useRef(null),
        useRef(null), useRef(null), useRef(null)
    ];

    const headlessModule = new OtplessHeadlessModule();

    useEffect(() => {
        headlessModule.initialize("936n5z8bp088ivs1951d"); // your actual key
        headlessModule.setResponseCallback(onHeadlessResult);
        return () => {
            headlessModule.clearListener();
            headlessModule.cleanup();
        };
    }, []);

    useEffect(() => {
        if (showOtp) {
            inputRefs[0].current?.focus();
        }
    }, [showOtp]);

    const handleConfirmOtp = () => {
        const fullOtp = otp.join('');
        if (fullOtp.length !== 6) {
            Alert.alert("Error", "Enter complete 6-digit OTP");
            return;
        }

        const request = {
            phone: mobile.trim(),
            countryCode: "91",
            otp: fullOtp,
        };

        headlessModule.start(request);
    };

    const onHeadlessResult = async (result) => {
        console.log("✅ OTPLESS RESPONSE:", result);
        headlessModule.commitResponse(result);
        const responseType = result.responseType;

        if (responseType === "INITIATE" && result.statusCode === 200) {
            setShowOtp(true);
        }

        if (responseType === "ONETAP" && result.statusCode === 200) {
            setShowResetForm(true);
        }


        if (responseType === "VERIFY" && result.statusCode !== 200) {
            Alert.alert("OTP Verification Failed", result.response?.errorMessage || "Invalid OTP.");
        }

        if (responseType === "OTP_AUTO_READ" && Platform.OS === "android") {
            const autoOtp = result.response.otp;
            if (autoOtp && autoOtp.length === 6) {
                setOtp(autoOtp.split(''));
            }
        }
    };
    const checkUserExists = async () => {
    try {
        const res = await fetch(`${baseUrl}check-user-exists`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mobile: mobile.trim(),
                email: "dummy@check.com", // dummy email to satisfy backend check
            }),
        });

        if (res.status === 409) {
            // ✅ Mobile number exists — this is expected
            return true;
        }

        // ❌ Not registered
        if (res.status === 200) {
            const result = await res.json();
            if (result?.message?.includes("available")) {
                Alert.alert("Error", "This mobile number is not registered.");
            }
            return false;
        }

        // ❌ Handle unexpected errors
        const errData = await res.json();
        Alert.alert("Error", errData?.error || "Unexpected error");
        return false;

    } catch (err) {
        console.error("❌ Server error:", err);
        Alert.alert("Error", "Something went wrong while checking user.");
        return false;
    }
};

    return (
        <SafeAreaView style={styles.container}>
            <View style={commonStyle.contentBox}>
                {showResetForm ? (
                    <>
                        <View style={commonStyle.section}>
                            <Text style={styles.title}>Reset Password</Text>
                            <Text style={styles.subTitle}>Enter your new password below</Text>
                        </View>

                        <View style={commonStyle.section}>
                            <TextInput
                                placeholder='New Password'
                                secureTextEntry
                                placeholderTextColor="#888"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                style={commonStyle.textInput}
                            />

                            <TextInput
                                placeholder='Confirm Password'
                                secureTextEntry
                                placeholderTextColor="#888"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                style={[commonStyle.textInput, { marginTop: 15 }]}
                            />

                            <TouchableOpacity
                                onPress={async () => {
                                    if (!newPassword || !confirmPassword) {
                                        Alert.alert("Error", "Please fill all fields.");
                                        return;
                                    }

                                    if (!isStrongPassword(newPassword)) {
                                        Alert.alert(
                                            "Weak Password",
                                            "Password must:\n• Be at least 8 characters\n• Include a letter\n• Include a number\n• Include a special character"
                                        );
                                        return;
                                    }

                                    if (newPassword !== confirmPassword) {
                                        Alert.alert("Error", "Passwords do not match.");
                                        return;
                                    }


                                    try {
                                        const response = await fetch(`${baseUrl}reset-password`, {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                mobile: mobile.trim(),
                                                newPassword: newPassword.trim(),
                                            }),
                                        });

                                        const data = await response.json();
                                        if (response.ok) {
                                            Alert.alert("Success", "Password reset successfully. Please login.");
                                            navigation.navigate("LoginScreen"); // or your login screen
                                        } else {
                                            Alert.alert("Error", data.error || "Password reset failed.");
                                        }
                                    } catch (err) {
                                        console.error("Reset Error:", err);
                                        Alert.alert("Error", "Something went wrong while resetting password.");
                                    }
                                }}
                                style={commonStyle.submitBtn}
                            >
                                <Text style={styles.btnText}>Submit</Text>
                            </TouchableOpacity>


                            <TouchableOpacity
                                style={{ marginTop: 20 }}
                                onPress={() => {
                                    setShowResetForm(false);
                                    setShowOtp(false);
                                    setOtp(['', '', '', '', '', '']);
                                }}
                            >
                                <Text style={commonStyle.linkText}>Go Back</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : showOtp ? (
                    <>
                        <View style={commonStyle.section}>
                            <Text style={styles.title}>Verification Code</Text>
                            <Text style={styles.subTitle}>We Have Sent The Verification Code To Your Mobile Number</Text>
                        </View>

                        <View style={[commonStyle.section, styles.otpContainer]}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={inputRefs[index]}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChangeText={(text) => {
                                        const newOtp = [...otp];
                                        newOtp[index] = text;
                                        setOtp(newOtp);
                                        if (text && index < inputRefs.length - 1) {
                                            inputRefs[index + 1].current?.focus();
                                        }
                                    }}
                                    onKeyPress={({ nativeEvent }) => {
                                        if (
                                            nativeEvent.key === 'Backspace' &&
                                            !otp[index] &&
                                            index > 0
                                        ) {
                                            inputRefs[index - 1].current?.focus();
                                        }
                                    }}
                                    style={styles.otpInput}
                                />
                            ))}
                        </View>

                        <TouchableOpacity style={[commonStyle.submitBtn, styles.confirmBtn]} onPress={handleConfirmOtp}>
                            <Text style={styles.confirmText}>Confirm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => { setShowOtp(false); setOtp(['', '', '', '', '', '']); }}>
                            <Text style={commonStyle.linkText}>Go Back</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>

                        <View style={commonStyle.section}>
                            <Text style={styles.title}>AI Based CMO Gallery</Text>
                            <Text style={styles.subTitle}>On Click Download</Text>
                        </View>

                        <View style={commonStyle.dividerContainer}>
                            <View style={{ ...commonStyle.hr, width: "20%" }}></View>
                            <View style={styles.centerText}><Text>Forgot Your Password?</Text></View>
                            <View style={{ ...commonStyle.hr, width: "20%" }}></View>
                        </View>

                        <View style={commonStyle.section}>
                            <TextInput
                                placeholder='Enter Your Mobile Number'
                                keyboardType="numeric"
                                contextMenuHidden={true} maxLength={10}
                                placeholderTextColor="#888"
                                value={mobile}
                                onChangeText={(text) => {
                                    setMobile(text)
                                    setIsInvalid({ mobile: false })
                                }
                                }
                                style={commonStyle.textInput} />
                            {isInvalid.mobile &&
                                <Text style={commonStyle.errorMessage}>Please enter 10 digit valid mobile</Text>
                            }
                            <TouchableOpacity onPress={submitHandle} style={commonStyle.submitBtn}>
                                <Text style={styles.btnText}>Send Now</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={commonStyle.section}>
                            <View style={styles.registerPrompt}>
                                <Text style={commonStyle.questionText}>Not Register Yet? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate("MobileRegisterScreen")}>
                                    <Text style={commonStyle.linkText}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Footer />

                    </>
                )}
            </View>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        flex: 1,
        paddingHorizontal: 10
    },

    title: {
        color: colors.primary,
        fontWeight: 700,
        fontSize: 24,
    },
    subTitle: {
        color: colors.primary,
        fontSize: 11
    },
    btnText: {
        color: colors.secondary,
        fontWeight: "bold"
    },

    googleBtnText: {

    },
    registerPrompt: {
        flexDirection: "row",
    },
    centerText: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 30
    },
    otpInput: {
        width: 45,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ccc',
        textAlign: 'center',
        fontSize: 20,
        backgroundColor: '#fff',
        elevation: 2,
    },
    confirmBtn: {
        borderRadius: 30,
    },
    confirmText: {
        color: 'yellow',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },


})

export default ForgotPasswordScreen