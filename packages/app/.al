function gradleDebug() {
	if [ -z "${1}" ]; then echo "must be in one of $(ls ./platformBuilds)"; fi;
	./gradlew assembleDebug -x bundleReleaseJsAndAssets
	popd
}
