import { Text, View, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/color';
import { useState } from 'react';
import commonStyle from '../components/Style';
import { baseUrl } from "../../services/apiConfig";
import Footer from '../components/Footer';
import GoogleSignIn from '../components/GoogleSignIn';
import { isValidMobile, isStrongPassword, isValidEmail } from '../../utils/Validation';
import { useEffect } from 'react';
import { OtplessHeadlessModule } from 'otpless-headless-rn';
import { Platform } from 'react-native';
import { Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Modal } from 'react-native';
import React, { useRef } from 'react'; // Add at the top if not already



const headlessModule = new OtplessHeadlessModule();

const MobileRegisterScreen = () => {
    const navigation = useNavigation();
    const [mobile, setMobile] = useState('');
    const [isInvalid, setIsInvalid] = useState({ mobile: false });
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [districts, setDistricts] = useState([]);
    const [password, setPassword] = useState('');
    const formDataRef = useRef(null);
    const [district, setDistrict] = useState('');
    const [showDistrictModal, setShowDistrictModal] = useState(false);
    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];




    const submitHandle = async () => {
        if (!name || !email || !district || !password || !isValidMobile(mobile)) {
            Alert.alert('Please fill all fields correctly');
            return;
        }
        if (!isValidEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        if (!isStrongPassword(password)) {
            Alert.alert(
                'Weak Password',
                'Password must:\n• Be at least 8 characters\n• Include a letter\n• Include a number\n• Include a special character'
            );
            return;
        }

        try {
            const res = await fetch(`${baseUrl}check-user-exists`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: mobile.trim(), email: email.trim() })
            });

            if (res.status === 409) {
                const errData = await res.json();
                Alert.alert(errData?.error || "Already registered");
                return;
            }

           if (res.status === 200) {
    formDataRef.current = {
        name,
        email,
        district,
        password,
        mobile: mobile.trim(),
    };
    headlessModule.start({ phone: mobile.trim(), countryCode: "91" });
}


        } catch (err) {
            Alert.alert('Network error while checking user.');
        }
    };

    useEffect(() => {
        if (showOtp) {
            inputRefs[0].current?.focus();
        }
    }, [showOtp]);


    useEffect(() => {
        headlessModule.initialize("936n5z8bp088ivs1951d"); // Replace with real ID
        headlessModule.setResponseCallback(onHeadlessResult);
        return () => {
            headlessModule.clearListener();
            headlessModule.cleanup();
        };
    }, []);

    const onHeadlessResult = async (result) => {
        console.log("✅ OTPLESS RESPONSE:", result);
        headlessModule.commitResponse(result);
        const responseType = result.responseType;

        if (responseType === "INITIATE" && result.statusCode === 200) {
            setShowOtp(true); // you can optionally show a waiting screen
        }

        if (responseType === "ONETAP" && result.statusCode === 200) {
    console.log("✅ OTP Link clicked. Proceeding with signup...");

    const dataToSend = formDataRef.current || result.context;

if (!dataToSend || !dataToSend.mobile) {
    Alert.alert("Error", "Form data missing. Please re-enter.");
    setShowOtp(false);
    return;
}


    try {
        const res = await fetch(`${baseUrl}complete-signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Otpless-Mobile': dataToSend.mobile
            },
            body: JSON.stringify(dataToSend)
        });

        const data = await res.json();

        if (res.status === 200) {
            Alert.alert("Success", "Account created successfully!");
            setTimeout(() => navigation.navigate("LoginScreen"), 500);
        } else {
            Alert.alert("Error", data?.error || "Signup failed.");
        }
    } catch (err) {
        console.error("❌ Signup error:", err);
        Alert.alert("Error", "Network error during signup.");
    }
}

        if (responseType === "VERIFY" && result.statusCode !== 200) {
            console.log("❌ VERIFY failed", result.response?.errorMessage);
            Alert.alert("OTP Verification Failed", result.response?.errorMessage || "Invalid OTP or expired link.");
        }

        if (responseType === "OTP_AUTO_READ" && Platform.OS === "android") {
            const autoOtp = result.response.otp;
            if (autoOtp && autoOtp.length === 6) {
                setOtp(autoOtp.split(''));
            }
        }
    };


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

        headlessModule.start(request); // ✅ this will trigger OTP verification
    };

    useEffect(() => {
        fetch(`${baseUrl}districts`)
            .then((res) => res.json())
            .then((data) => setDistricts(data))
            .catch((err) => console.error("Failed to fetch districts:", err));
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            <View style={commonStyle.contentBox}>
                {showOtp ? (
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

                                        // Move to next input
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
                        <View style={commonStyle.section}>
                            <TouchableOpacity style={[commonStyle.submitBtn, styles.confirmBtn]} onPress={handleConfirmOtp}>
                                <Text style={styles.confirmText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                            <Text style={commonStyle.questionText}>Entered wrong number? </Text>
                            <TouchableOpacity onPress={() => {
                                setShowOtp(false);
                                setOtp(['', '', '', '', '', '']);
                            }}>
                                <Text style={commonStyle.linkText}>Go Back</Text>
                            </TouchableOpacity>
                        </View>

                    </>
                ) : (
                    <>
                        <View style={commonStyle.section}>
                            <Text style={styles.title}>AI Based CMO Gallery</Text>
                            <Text style={styles.subTitle}>One Click Download</Text>
                        </View>

                        <GoogleSignIn />

                        <View style={commonStyle.dividerContainer}>
                            <View style={{ ...commonStyle.hr, width: '20%' }}></View>
                            <View style={commonStyle.centerText}><Text>Or Sign Up With Mobile</Text></View>
                            <View style={{ ...commonStyle.hr, width: '20%' }}></View>
                        </View>

                        <View style={commonStyle.section}>
                            <TextInput
                                placeholder="Full Name"
                                placeholderTextColor="#888"
                                value={name}
                                onChangeText={setName}
                                style={[commonStyle.textInput, { marginBottom: 12 }]}
                            />

                            <TextInput
                                placeholder="Mobile No."
                                placeholderTextColor="#888"
                                keyboardType="numeric"
                                maxLength={10}
                                value={mobile}
                                onChangeText={(text) => {
                                    setMobile(text);
                                    setIsInvalid({ ...isInvalid, mobile: false });
                                }}
                                style={[commonStyle.textInput, { marginBottom: 12 }]}
                            />

                            <TextInput
                                placeholder="Email Id"
                                placeholderTextColor="#888"
                                value={email}
                                onChangeText={setEmail}
                                style={[commonStyle.textInput, { marginBottom: 12 }]}
                            />


                            <View style={[commonStyle.textInput, { marginBottom: 12, alignItems: 'start', }]}>
                                <TouchableOpacity
                                    onPress={() => setShowDistrictModal(true)}

                                >
                                    <Text style={{ color: district ? '#170645' : '#888' }}>
                                        {district || 'Select District'}
                                    </Text>
                                </TouchableOpacity>

                                {/* Modal for district selection */}
                                <Modal visible={showDistrictModal} transparent animationType="slide">
                                    <TouchableOpacity
                                        onPress={() => setShowDistrictModal(false)}
                                        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
                                        activeOpacity={1}
                                    >
                                        <View
                                            style={{
                                                backgroundColor: 'white',
                                                margin: 20,
                                                borderRadius: 12,
                                                padding: 20,
                                                maxHeight: '100%'  // limit height
                                            }}
                                        >
                                            <ScrollView>
                                                {districts.map((item, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        onPress={() => {
                                                            setDistrict(item.name);
                                                            setShowDistrictModal(false);
                                                        }}
                                                        style={[
                                                            commonStyle.textInput,
                                                            {
                                                                paddingVertical: 12,
                                                                paddingHorizontal: 16,
                                                                marginBottom: 8,
                                                                borderWidth: 1,
                                                                borderColor: '#ccc',
                                                                borderRadius: 8,
                                                                marginLeft: 12,
                                                            },
                                                        ]}
                                                    >
                                                        <Text style={{ color: '#000' }}>{item.name}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    </TouchableOpacity>
                                </Modal>

                            </View>


                            <TextInput
                                placeholder="Create Your Password"
                                placeholderTextColor="#888"
                                secureTextEntry={true}
                                value={password}
                                onChangeText={setPassword}
                                style={[commonStyle.textInput, { marginBottom: 20 }]}
                            />

                            <TouchableOpacity onPress={submitHandle} style={commonStyle.submitBtn}>
                                <Text style={styles.btnText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={commonStyle.section}>
                            <View style={styles.registerPrompt}>
                                <Text style={commonStyle.questionText}>Already Registered? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                                    <Text style={commonStyle.linkText}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Footer />
                    </>
                )}
            </View>

        </SafeAreaView>
    )
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


export default MobileRegisterScreen
