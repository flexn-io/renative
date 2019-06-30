FROM runmymind/docker-android-sdk:ubuntu-standalone

ENV PATH="/opt/android-sdk-linux/tools/bin:${PATH}"

# create the dirs
RUN mkdir /rnv
WORKDIR /rnv

# copy the project
COPY . .


# install node
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && apt-get install -y nodejs

# install the sdks used for the test to create the avd
RUN sdkmanager "system-images;android-28;default;x86"

# build, link and setup rnv
RUN npm link && mkdir /root/.rnv/ && echo '{"sdks":{"ANDROID_SDK":"/opt/android-sdk-linux"},"defaultTargets":{"android":"Nexus_5X_API_26","androidtv":"Android_TV_720p_API_22","androidwear":"Android_Wear_Round_API_28"}}' > /root/.rnv/config.json

RUN echo "no" | avdmanager create avd -n android_test -k "system-images;android-28;default;x86"
