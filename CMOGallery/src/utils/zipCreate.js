import RNFS from 'react-native-fs';
import { zip } from 'react-native-zip-archive';
import { Platform, Alert } from 'react-native';
export const downloadAndZipImages = async (imageUrls) => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      console.warn('❌ Storage permission denied');
      return;
    }
  
    const tempFolderPath = `${RNFS.DocumentDirectoryPath}/tempImages`;
  
    // 🧹 Clean up old temp folder
    if (await RNFS.exists(tempFolderPath)) {
      await RNFS.unlink(tempFolderPath);
    }
    await RNFS.mkdir(tempFolderPath);
  
    // 📥 Download each image
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const filename = `image_${i}.jpg`;
      const destPath = `${tempFolderPath}/${filename}`;
  
      try {
        const result = await RNFS.downloadFile({
          fromUrl: url,
          toFile: destPath,
        }).promise;
  
        if (result.statusCode !== 200) {
          console.warn(`⚠️ Download failed for ${url}, status: ${result.statusCode}`);
        }
      } catch (err) {
        console.error(`❌ Failed to download ${url}`, err);
      }
    }
  
    // 🗜️ Create ZIP file in Download folder
    const zipPath = `${RNFS.DownloadDirectoryPath}/my_images_${Date.now()}.zip`;
  
    try {
      const result = await zip(tempFolderPath, zipPath);
      return result;
    } catch (error) {
      alert('Something went wrong')
      console.error('❌ ZIP creation failed:', error);
    }

    return true;
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'ios')
      return true;
  
    if (Platform.OS === 'android') {
      let androidVersion = Platform.Version;
      if(androidVersion > 11) return true;
    try {
      const granted = await request(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
      );
  
      return (granted === RESULTS.GRANTED);
    } catch (err) {
      return false;
    }
    }
  };