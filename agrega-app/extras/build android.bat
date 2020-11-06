echo "Android Builder"
echo "Criando apk..."
cd C:\Program Files\Java\jdk1.8.0_201\bin
@jarsigner -sigalg SHA1withRSA -digestalg SHA1 -keystore agrega.keystore app-release-unsigned.apk agrega
echo "Zipando..."
@C:\Users\guilh\AppData\Local\Android\Sdk\build-tools\28.0.3\zipalign -v 4 app-release-unsigned.apk agrega.apk