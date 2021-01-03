FROM runmymind/docker-android-sdk:ubuntu-standalone

ENV PATH="/opt/android-sdk-linux/tools/bin:${PATH}"

# create the dirs
RUN mkdir /rnv
WORKDIR /rnv

# install node
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && apt-get install -y nodejs

# install the sdks used for the test to create the avd
RUN sdkmanager "system-images;android-28;default;x86"

# copy the project
COPY . .

# build, link and setup rnv
RUN npm link && mkdir /root/.rnv/ && echo '{"sdks":{"ANDROID_SDK":"/opt/android-sdk-linux"},"defaultTargets":{"android":"Nexus_5X_API_26","androidtv":"Android_TV_720p_API_22","firetv":"Android_TV_720p_API_22","androidwear":"Android_Wear_Round_API_28"}}' > /root/.rnv/renative.json

RUN npm link && mkdir /root/.rnv/ && echo '{"workspaces":{"rnv":{"path":"/root/.rnv"}}}' > /root/.rnv/renative.workspaces.json


# RUN echo "no" | avdmanager create avd -n android_test -k "system-images;android-28;default;x86"
# RUN echo "no" | avdmanager create avd -n android_test -k "system-images;android-28;default;armeabi-v7a"
RUN echo "no" | android create avd -n android_test -t android-28 --abi x86
